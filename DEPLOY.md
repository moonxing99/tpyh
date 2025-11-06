# 部署说明

## 概述

本项目分为两部分：
1. **前端**：已部署到 GitHub Pages (`https://moonxing99.github.io/tpyh/`)
2. **后端**：需要单独部署到云服务（推荐 Vercel、Railway 或 Render）

## 后端部署步骤

### 方案 1：使用 Vercel（推荐）

1. **安装 Vercel CLI**（如果还没有）：
   ```bash
   npm i -g vercel
   ```

2. **在项目根目录创建 `vercel.json`**：
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.js"
       }
     ]
   }
   ```

3. **部署**：
   ```bash
   vercel
   ```

4. **设置环境变量**：
   - 在 Vercel 项目设置中添加 `COZE_API_KEY`
   - 值为你的 Coze API Key

5. **获取部署后的域名**：
   - 部署完成后，Vercel 会给你一个域名，例如：`https://your-project.vercel.app`
   - 复制这个域名

### 方案 2：使用 Railway

1. 访问 [Railway](https://railway.app/)
2. 创建新项目，选择 "Deploy from GitHub repo"
3. 选择你的仓库
4. 在项目设置中添加环境变量：
   - `COZE_API_KEY`: 你的 Coze API Key
   - `PORT`: Railway 会自动设置，无需手动配置
5. Railway 会自动部署，获取部署后的域名

### 方案 3：使用 Render

1. 访问 [Render](https://render.com/)
2. 创建新的 "Web Service"
3. 连接你的 GitHub 仓库
4. 设置：
   - **Build Command**: 留空（不需要构建）
   - **Start Command**: `node server/index.js`
   - **Environment**: Node
5. 添加环境变量：
   - `COZE_API_KEY`: 你的 Coze API Key
6. 部署后获取域名

## 配置前端环境变量

部署后端后，需要在前端代码中配置后端 API 地址。

### 方法 1：使用 GitHub Actions 环境变量（推荐）

1. 在 GitHub 仓库设置中添加 Secret：
   - 进入仓库 → Settings → Secrets and variables → Actions
   - 添加 `VITE_API_URL`，值为你的后端域名（例如：`https://your-project.vercel.app`）

2. 修改 `.github/workflows/deploy.yml`，在 build 步骤中添加：
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_API_URL: ${{ secrets.VITE_API_URL }}
   ```

### 方法 2：直接修改代码（不推荐，但简单）

在 `src/pages/Index.jsx` 中，修改第 15 行：
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-domain.com';
```

将 `https://your-backend-domain.com` 替换为你的实际后端域名。

## 验证部署

1. 访问前端：`https://moonxing99.github.io/tpyh/`
2. 打开浏览器开发者工具（F12）
3. 尝试上传图片或生成图片
4. 检查 Network 标签，确认 API 请求指向你的后端域名
5. 如果出现 CORS 错误，检查后端 CORS 配置是否包含 `https://moonxing99.github.io`

## 常见问题

### 1. CORS 错误
- 确保后端 CORS 配置包含前端域名
- 检查 `server/index.js` 中的 `allowedOrigins` 数组

### 2. API 请求失败
- 检查后端是否正常运行
- 检查环境变量 `COZE_API_KEY` 是否正确设置
- 查看后端日志

### 3. 图片不显示
- 检查图片代理路径是否正确
- 确认后端 `/api/proxy_image` 接口正常工作

## 本地开发

本地开发时，前端会自动使用 `http://127.0.0.1:8788`（默认值）。

启动后端：
```bash
npm run server
```

启动前端：
```bash
npm run dev
```

或同时启动：
```bash
npm run dev:all
```

