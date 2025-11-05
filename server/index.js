// 简易 Coze 代理服务（开发用）
// 环境变量：COZE_API_KEY
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
// 允许读取反向代理头（如 localtunnel / ngrok），用于拼接公网可访问的回链
app.set('trust proxy', true);
const PORT = process.env.PORT || 8787;

app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ],
  credentials: false,
}));
app.use(express.json({ limit: '2mb' }));

app.post('/api/coze/stream_run', async (req, res) => {
  try {
    const apiKey = process.env.COZE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'COZE_API_KEY is not set on server' });
    }

    const { workflow_id, app_id, parameters } = req.body || {};
    if (!workflow_id || !app_id) {
      return res.status(400).json({ error: 'workflow_id and app_id are required' });
    }

    const cozeResp = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workflow_id, app_id, parameters }),
    });

    // 将 Coze 的流式回包转发给前端
    res.status(cozeResp.status);
    for (const [k, v] of cozeResp.headers) {
      // 只透传和流式相关的必要头
      if (['content-type', 'transfer-encoding'].includes(k)) {
        res.setHeader(k, v);
      }
    }

    if (!cozeResp.body) {
      const text = await cozeResp.text();
      return res.end(text);
    }

    const reader = cozeResp.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
    res.end();
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'proxy_failed' });
  }
});

// 代理远端图片，解决部分 CDN 防盗链/Referer 限制
app.get('/api/proxy_image', async (req, res) => {
  try {
    const target = req.query.u;
    if (typeof target !== 'string' || !/^https?:\/\//i.test(target)) {
      return res.status(400).send('bad url');
    }
    const upstream = await fetch(target, {
      // 伪装为常见浏览器，并携带可接受的 Referer，允许重定向
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0 Safari/537.36',
        'Referer': 'https://www.coze.cn/',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });
    if (!upstream.ok || !upstream.body) {
      console.error('proxy_image upstream failed:', upstream.status, upstream.statusText);
      return res.status(upstream.status).end();
    }
    // 透传常见图片头
    const ct = upstream.headers.get('content-type') || 'image/png';
    res.setHeader('Content-Type', ct);
    // CORS 头，允许前端跨域访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    const cc = upstream.headers.get('cache-control');
    if (cc) res.setHeader('Cache-Control', cc);
    const reader = upstream.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (e) {
    console.error('proxy_image error', e);
    res.status(500).json({ error: String(e) }).end();
  }
});

// 简易文件服务：支持把 dataURL 转为 http 可访问链接（供工作流使用）
const tmpDir = path.join(os.tmpdir(), 'coze-proxy-static');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
app.use('/static', express.static(tmpDir));

app.post('/api/upload', async (req, res) => {
  try {
    const { dataUrl } = req.body || {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'invalid_data_url' });
    }
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) return res.status(400).json({ error: 'invalid_base64' });
    const ext = (match[1] || 'image/png').split('/')[1] || 'png';
    const buf = Buffer.from(match[2], 'base64');
    const filename = `up_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(tmpDir, filename);
    fs.writeFileSync(filePath, buf);
    // 计算对外可访问的基址
    const forwardedHost = req.headers['x-forwarded-host'];
    const forwardedProto = req.headers['x-forwarded-proto'];
    const baseHost = process.env.PUBLIC_BASE || forwardedHost || req.get('host');
    const baseProto = process.env.PUBLIC_PROTO || forwardedProto || req.protocol || 'http';
    const url = `${baseProto}://${baseHost}/static/${filename}`;
    res.json({ url });
  } catch (e) {
    console.error('upload error', e);
    res.status(500).json({ error: 'upload_failed' });
  }
});

// 直接把图片上传到 Coze 文件上传接口，返回 Coze 可访问的文件信息
app.post('/api/coze/file_upload', async (req, res) => {
  try {
    const apiKey = process.env.COZE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'COZE_API_KEY is not set on server' });
    }
    const { dataUrl } = req.body || {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'invalid_data_url' });
    }
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) return res.status(400).json({ error: 'invalid_base64' });
    const mime = match[1] || 'image/png';
    const buf = Buffer.from(match[2], 'base64');
    const ext = (mime.split('/')[1] || 'png').replace(/[^a-z0-9]/gi, '');
    const filename = `upload_${Date.now()}.${ext}`;

    // Node 18+ 自带 FormData / File / Blob
    const form = new FormData();
    const file = new File([buf], filename, { type: mime });
    form.append('file', file);

    const up = await fetch('https://api.coze.cn/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
    });
    const json = await up.json();
    if (!up.ok) {
      return res.status(up.status).json(json);
    }
    // 透传 Coze 的返回（通常包含 file_id / url 等）
    res.json(json);
  } catch (e) {
    console.error('coze file upload error', e);
    res.status(500).json({ error: 'coze_upload_failed' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Coze proxy server listening on http://localhost:${PORT}`);
});


