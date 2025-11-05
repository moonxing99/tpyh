import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/components/ImageEditor/ImageUploader';
import BackgroundSelector from '@/components/ImageEditor/BackgroundSelector';
import SellingPointSelector from '@/components/ImageEditor/SellingPointSelector';
import MarketingBoxSelector from '@/components/ImageEditor/MarketingBoxSelector';
import ResultPreview from '@/components/ImageEditor/ResultPreview';
import PhoneFrame from '@/components/ImageEditor/PhoneFrame';
import ProductPreview from '@/components/ImageEditor/ProductPreview';
const avatarImg = import.meta.env.BASE_URL + '头像.png';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isCuttingOut, setIsCuttingOut] = useState(false); // 是否正在抠图
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [settings, setSettings] = useState({
    sellingPoint: { template: 'sp1' },
    marketingBox: { template: 'mb1' }
  });
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [middleTabValue, setMiddleTabValue] = useState('editCanvas');
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState(null);
  const [generationTime, setGenerationTime] = useState(new Date());
  const [isDemoGenerating, setIsDemoGenerating] = useState(false);
  // 标记是否已拿到最终图片
  const gotFinalRef = useRef(false);
  const [canvasDisplayImage, setCanvasDisplayImage] = useState(null);
  const canvasRef = useRef(null); // 编辑画布的 DOM 引用
  const [canvasPreviewImage, setCanvasPreviewImage] = useState(null); // 已不用于预览区展示
  const [selectedSellingTemplate, setSelectedSellingTemplate] = useState(null); // 'sp1' | 'sp2' | 'sp3' | null
  const [selectedMarketingTemplate, setSelectedMarketingTemplate] = useState(null); // 'mb1' | 'mb2' | 'mb3' | null
  const [templateOverlaySrc, setTemplateOverlaySrc] = useState('');
  const [workflowParams, setWorkflowParams] = useState({
    zhuzhi1: '', // 产品介绍—主文案1
    zhuzhi2: '', // 产品介绍—主文案2
    md1: '', // 产品介绍—卖点文案1
    md2: '', // 产品介绍—卖点文案2
    pinpai1: '', // 品牌名称
    k_gj: '', // 选择营销样式:框or挂件
    k_jiage: '', // 营销框—价格
    k_md: '', // 营销框—卖点
    k_hdm: '', // 营销框—活动名
    gj_hdm: '', // 营销挂件—活动名
    jieshao: '是' // 是否添加产品介绍
  });

  // 抠图工作流：上传图片后自动调用，返回抠图后的图片
  const callImageCutoutWorkflow = async (imageUrl) => {
    try {
      console.log('[Image Cutout] 开始调用抠图工作流');
      setIsCuttingOut(true);
      
      // 将 dataURL 转为可访问的 http 链接（工作流的 Image 类型通常不接受 base64）
      let imageUrlToSend = imageUrl;
      let imageFileId = null;
      if (typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
        try {
          // 优先上传到 Coze 文件接口
          const up = await fetch('http://127.0.0.1:8788/api/coze/file_upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: imageUrl })
          });
          const upJson = await up.json();
          const tryGetUrl =
            upJson?.url ||
            upJson?.data?.url ||
            upJson?.data?.file_url ||
            upJson?.file_url ||
            upJson?.data?.file?.url ||
            null;
          if (up.ok && tryGetUrl) {
            imageUrlToSend = tryGetUrl;
          } else if (up.ok && upJson?.data?.id) {
            imageFileId = String(upJson.data.id);
          }
        } catch (e) {
          console.warn('[Image Cutout] 图片上传失败:', e);
        }
      }
      
      console.log('[Image Cutout] 使用图片:', imageFileId ? `file_id: ${imageFileId}` : `URL: ${imageUrlToSend}`);
      
      const resp = await fetch('http://127.0.0.1:8788/api/coze/stream_run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow_id: '7569132112386113586',
          app_id: '7551624988181921855',
          parameters: {
            // 如果 Coze 返回了 file_id，使用 { file_id: ... } 格式；否则使用 URL
            image: imageFileId ? { file_id: imageFileId } : imageUrlToSend
          }
        })
      });
      
      if (!resp.ok || !resp.body) {
        throw new Error('抠图工作流请求失败');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let cutoutImageUrl = null;

      // 提取图片 URL 的逻辑（与图片生成工作流类似）
      const extractImageUrl = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        
        // 递归查找所有 HTTP(S) URL
        const findUrls = (val, depth = 0) => {
          if (depth > 5) return []; // 防止无限递归
          if (typeof val === 'string') {
            // 检查是否是 URL
            if (/^https?:\/\//.test(val)) {
              // 过滤掉非图片 URL（如 debug_url）
              if (!val.includes('work_flow') && !val.includes('execute_id') && !val.includes('debug')) {
                return [val];
              }
            }
            // 尝试解析 JSON 字符串
            try {
              const parsed = JSON.parse(val);
              return findUrls(parsed, depth + 1);
            } catch {
              return [];
            }
          }
          if (Array.isArray(val)) {
            return val.flatMap(item => findUrls(item, depth + 1));
          }
          if (val && typeof val === 'object') {
            return Object.values(val).flatMap(v => findUrls(v, depth + 1));
          }
          return [];
        };
        
        const maybeContent = obj.content || obj.output || obj.data || obj;
        const urls = findUrls(maybeContent);
        
        // 返回第一个有效的图片 URL
        if (urls.length > 0) {
          return urls[0];
        }
        
        return null;
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log('[Image Cutout] 流结束, cutoutImageUrl=', cutoutImageUrl);
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        for (const chunk of parts) {
          const line = chunk.split('\n').find(l => l.trim().startsWith('data:')) || chunk;
          const payload = line.trim().startsWith('data:') ? line.trim().slice(5).trim() : line.trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const evt = JSON.parse(payload);
            
            // 检查是否是错误事件
            if (evt.event === 'Error' || evt.error_code) {
              const errorMsg = evt.error_message || evt.error_code || '未知错误';
              const errorCode = evt.error_code || 'unknown';
              console.error(`[Image Cutout] 工作流错误 [${errorCode}]:`, errorMsg);
              break;
            }
            
            // 尝试提取图片 URL
            const url = extractImageUrl(evt);
            if (url) {
              cutoutImageUrl = url;
              console.log('[Image Cutout] 提取到抠图图片 URL:', url);
            }
          } catch (e) {
            // ignore
          }
        }
      }
      
      if (cutoutImageUrl) {
        console.log('[Image Cutout] 抠图成功，图片 URL:', cutoutImageUrl);
        return cutoutImageUrl;
      } else {
        console.warn('[Image Cutout] 未提取到抠图图片');
        return null;
      }
    } catch (e) {
      console.error('[Image Cutout] 抠图工作流失败:', e);
      return null;
    } finally {
      setIsCuttingOut(false);
    }
  };

  const handleImageUpload = async (imageUrl) => {
    // 先设置原始图片
    setUploadedImage(imageUrl);
    setCanvasDisplayImage(null); // 重置画布显示
    
    // 自动调用抠图工作流
    try {
      const cutoutImageUrl = await callImageCutoutWorkflow(imageUrl);
      if (cutoutImageUrl) {
        // 将抠图后的图片替换原始图片
        console.log('[Image Upload] 抠图完成，使用抠图后的图片');
        setUploadedImage(cutoutImageUrl);
      } else {
        console.log('[Image Upload] 抠图失败，使用原始图片');
      }
    } catch (e) {
      console.error('[Image Upload] 抠图过程出错:', e);
      // 抠图失败时，继续使用原始图片
    }
  };

  const handleBackgroundSelect = (backgroundUrl) => {
    setSelectedBackground(backgroundUrl);
  };

  const handleSettingsChange = (type, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [type]: newSettings
    }));
  };

  const handleRegenerate = () => {
    // 重新生成图片
    setGeneratedImages([]);
  };

  // 画布侧实时编辑：统一处理输入与 IME
  const composingRef = React.useRef(false);
  const handleCanvasInput = (field) => (e) => {
    if (composingRef.current) return;
    const text = (e.currentTarget.textContent || '').trim();
    setWorkflowParams(prev => ({ ...prev, [field]: text }));
  };
  const handleCanvasBlur = (field) => (e) => {
    const text = (e.currentTarget.textContent || '').trim();
    setWorkflowParams(prev => ({ ...prev, [field]: text }));
  };

  // 文案优化工作流：点击 AI 帮写时触发，解析返回并写入对应输入框
  // 返回 true 表示成功提取到数据，false 表示失败或未提取到数据
  const callCopyOptimizeWorkflow = async () => {
    try {
      console.log('[AI Help] 开始调用文案优化工作流');
      
      // 检查是否有上传的图片
      if (!uploadedImage) {
        console.warn('[AI Help] 未上传商品图片，无法调用工作流');
        return;
      }
      
      // 将 dataURL 转为可访问的 http 链接（工作流的 Image 类型通常不接受 base64）
      let imageUrlToSend = uploadedImage; // 可为 http(s) 链接
      let imageFileId = null; // Coze 文件直传返回的 file_id
      if (typeof uploadedImage === 'string' && uploadedImage.startsWith('data:')) {
        try {
          // 优先上传到 Coze 文件接口，拿到 Coze 可访问的 URL
          const up = await fetch('http://127.0.0.1:8788/api/coze/file_upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: uploadedImage })
          });
          const upJson = await up.json();
          console.log('[AI Help] Coze 文件上传返回:', upJson);
          console.log('[AI Help] Coze 返回的 data 对象:', upJson?.data);
          
          // Coze 可能返回的字段：url / data.url / file_url / data.file_url / data.file.url
          // 也可能在 data 对象下有其他字段
          const tryGetUrl =
            upJson?.url ||
            upJson?.data?.url ||
            upJson?.data?.file_url ||
            upJson?.file_url ||
            upJson?.data?.file?.url ||
            (upJson?.data && typeof upJson.data === 'object' ? Object.values(upJson.data).find(v => typeof v === 'string' && /^https?:\/\//.test(v)) : null) ||
            null;
          
          if (up.ok && tryGetUrl) {
            imageUrlToSend = tryGetUrl;
            console.log('[AI Help] 使用 Coze URL:', imageUrlToSend);
          } else if (up.ok && upJson?.data?.id) {
            // Coze 上传成功，返回了 file_id（无直接 URL），直接使用 file_id
            imageFileId = String(upJson.data.id);
            console.log('[AI Help] Coze 返回 file_id，将使用 { file_id: ... } 格式:', imageFileId);
            // 不设置 imageUrlToSend，后续使用 imageFileId
          } else if (up.ok) {
            // Coze 上传成功但没有 URL 也没有 file_id，回退到本地上传
            console.warn('[AI Help] Coze 上传成功但未返回 URL 或 file_id，回退到本地上传');
            const localUp = await fetch('http://127.0.0.1:8788/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl: uploadedImage })
            });
            const localJson = await localUp.json();
            if (localUp.ok && localJson.url) {
              imageUrlToSend = localJson.url;
              // 检查是否是公网可访问的 URL（不是 127.0.0.1 或 localhost）
              if (imageUrlToSend.includes('127.0.0.1') || imageUrlToSend.includes('localhost')) {
                console.error('[AI Help] 警告：本地 URL 无法被 Coze 访问，需要配置公网隧道（localtunnel/ngrok）');
                throw new Error('本地 URL 无法被 Coze 访问，请配置公网隧道');
              }
            } else {
              throw new Error('本地上传失败');
            }
          }
          
          // 如果 Coze 上传失败，回退到本地静态上传
          if (!up.ok) {
            console.warn('[AI Help] Coze 文件上传失败，回退到本地上传');
            const localUp = await fetch('http://127.0.0.1:8788/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl: uploadedImage })
            });
            const localJson = await localUp.json();
            if (localUp.ok && localJson.url) {
              imageUrlToSend = localJson.url;
              // 检查是否是公网可访问的 URL
              if (imageUrlToSend.includes('127.0.0.1') || imageUrlToSend.includes('localhost')) {
                console.error('[AI Help] 警告：本地 URL 无法被 Coze 访问，需要配置公网隧道（localtunnel/ngrok）');
                throw new Error('本地 URL 无法被 Coze 访问，请配置公网隧道');
              }
            } else {
              throw new Error('图片上传失败');
            }
          }
        } catch (e) {
          console.error('[AI Help] 图片上传失败:', e);
          throw e; // 重新抛出，让上层处理
        }
      }
      
      console.log('[AI Help] 使用图片:', imageFileId ? `file_id: ${imageFileId}` : `URL: ${imageUrlToSend}`);
      
      const resp = await fetch('http://127.0.0.1:8788/api/coze/stream_run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow_id: '7568793170378440747',
          app_id: '7551624988181921855',
          parameters: {
            // 如果 Coze 返回了 file_id，使用 { file_id: ... } 格式；否则使用 URL
            image: imageFileId ? { file_id: imageFileId } : imageUrlToSend
          }
        })
      });
      
      if (!resp.ok) {
        console.error('[AI Help] 工作流请求失败:', resp.status, resp.statusText);
        throw new Error(`copy_workflow_failed: ${resp.status}`);
      }
      
      if (!resp.body) {
        console.error('[AI Help] 响应体为空');
        throw new Error('copy_workflow_failed: no body');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let filled = false;
      
      // 简单的字段提取
      const normalize = (val) => (typeof val === 'string' ? val : (val == null ? '' : String(val)));
      const tryFillFrom = (obj) => {
        if (!obj || typeof obj !== 'object') return false;
        const payload = obj;
        
        // 跳过错误事件和完成事件
        if (payload.debug_url && !payload.content && !payload.output && !payload.data) {
          return false;
        }
        
        const maybeContent = payload.content || payload.output || payload.data || payload;
        let source = maybeContent;
        
        // 如果内容是字符串，尝试解析为 JSON（可能需要多次解析）
        if (typeof maybeContent === 'string') {
          try { 
            // 先尝试解析一次
            let parsed = JSON.parse(maybeContent);
            // 如果解析后仍然是字符串，继续解析
            while (typeof parsed === 'string') {
              try {
                parsed = JSON.parse(parsed);
              } catch {
                break; // 无法继续解析，使用上一次的结果
              }
            }
            source = parsed;
          } catch (e) {
            // 如果解析失败，尝试检查是否是 JSON 字符串（去掉可能的引号）
            const trimmed = maybeContent.trim();
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
              try {
                const unquoted = JSON.parse(trimmed); // 去掉外层引号
                if (typeof unquoted === 'string') {
                  source = JSON.parse(unquoted); // 再解析一次
                } else {
                  source = unquoted;
                }
              } catch (e2) {
                console.warn('[AI Help] JSON 解析失败:', e2, 'maybeContent:', maybeContent);
              }
            } else {
              console.warn('[AI Help] JSON 解析失败:', e, 'maybeContent:', maybeContent);
            }
          }
        }
        
        // 如果 source 仍然是字符串，尝试再次解析
        if (typeof source === 'string' && source.trim().startsWith('{')) {
          try {
            source = JSON.parse(source);
          } catch (e) {
            console.warn('[AI Help] 最终解析失败:', e, 'source:', source);
          }
        }
        
        if (!source || typeof source !== 'object') {
          console.warn('[AI Help] source 不是对象:', typeof source, source);
          return false;
        }
        
        // 打印所有字段名，便于调试
        console.log('[AI Help] 原始数据的所有字段:', Object.keys(source));
        console.log('[AI Help] 原始数据完整内容:', JSON.stringify(source, null, 2));
        
        // 支持多种字段名格式：
        // 格式1: main_text_1, main_text_2, sub_text_1, sub_text_2, selling_point, promotion_text, brand_name
        // 格式2: main1, main2, subl, sub2, selling_point, promotion_text, brand_name
        // 尝试从多个可能的字段名中提取品牌名称
        const brand = normalize(
          source.brand_name || 
          source['brand_name'] ||
          source.brandName ||
          source.brand ||
          source.pinpai1 ||
          source.pinpai ||
          source.pinpai_name ||
          source.pinpaiName ||
          source.brand_name_text ||
          source.brandNameText ||
          // 尝试从嵌套结构中提取
          source.data?.brand_name ||
          source.data?.brandName ||
          source.result?.brand_name ||
          source.result?.brandName
        );
        console.log('[AI Help] 尝试提取品牌名称:', {
          'brand_name': source.brand_name,
          'brandName': source.brandName,
          'brand': source.brand,
          'pinpai1': source.pinpai1,
          'source.data?.brand_name': source.data?.brand_name,
          'source.result?.brand_name': source.result?.brand_name,
          '提取结果': brand
        });
        const main1 = normalize(
          source.main_text_1 || 
          source.main1 || 
          source.main_text1
        );
        const main2 = normalize(
          source.main_text_2 || 
          source.main2 || 
          source.main_text2
        );
        const sub1  = normalize(
          source.sub_text_1 || 
          source.sub_text1 ||
          source.subl ||
          source.sub1
        );
        const sub2  = normalize(
          source.sub_text_2 || 
          source.sub_text2 ||
          source.sub2
        );
        const sell  = normalize(
          source.selling_point || 
          source.sellingPoint ||
          source.sell ||
          source.k_md
        );
        const promo = normalize(
          source.promotion_text || 
          source.promotionText ||
          source.promo ||
          source.k_hdm
        );
        const hasAny = brand || main1 || main2 || sub1 || sub2 || sell || promo;
        if (!hasAny) return false;
        
        console.log('[AI Help] 提取到文案:', { brand, main1, main2, sub1, sub2, sell, promo });
        console.log('[AI Help] 原始数据:', source);
        
        // 使用函数式更新，确保能访问到最新的 workflowParams
        setWorkflowParams(prev => {
          const updatedParams = {
            ...prev,
            // 品牌名称限制为 5 个字符
            pinpai1: brand ? brand.slice(0, 5) : prev.pinpai1,
            zhuzhi1: main1 || prev.zhuzhi1,
            zhuzhi2: main2 || prev.zhuzhi2,
            md1: sub1 || prev.md1,
            md2: sub2 || prev.md2,
            k_md: sell || prev.k_md,
            k_hdm: promo || prev.k_hdm,
          };
          console.log('[AI Help] 更新 workflowParams:', {
            '更新前 pinpai1': prev.pinpai1,
            '提取的 brand': brand,
            '更新后 pinpai1': updatedParams.pinpai1,
            '完整更新': updatedParams
          });
          return updatedParams;
        });
        return true;
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log('[AI Help] 流结束, filled=', filled);
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        for (const chunk of parts) {
          const line = chunk.split('\n').find(l => l.trim().startsWith('data:')) || chunk;
          const payload = line.trim().startsWith('data:') ? line.trim().slice(5).trim() : line.trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const evt = JSON.parse(payload);
            console.log('[AI Help] 解析事件:', evt);
            
            // 检查是否是错误事件或完成事件（包含 debug_url 的事件通常不是数据）
            if (evt.event === 'Error' || evt.error_code || evt.debug_url) {
              if (evt.event === 'Error' || evt.error_code) {
                const errorMsg = evt.error_message || evt.error_code || '未知错误';
                const errorCode = evt.error_code || 'unknown';
                console.error(`[AI Help] 工作流错误 [${errorCode}]:`, errorMsg);
                // 如果是权限或资源错误，提示用户
                if (errorCode === 4200) {
                  console.error('[AI Help] 工作流 ID 可能不存在或 API Key 无权限访问');
                }
                // 错误事件，不继续处理，直接跳出
                break;
              }
              // debug_url 事件（通常是完成事件），跳过不处理
              if (evt.debug_url && !evt.content && !evt.output && !evt.data) {
                console.log('[AI Help] 跳过完成事件（仅包含 debug_url）');
                continue;
              }
            }
            
            // 直接尝试从事件中提取
            if (tryFillFrom(evt)) {
              filled = true;
              console.log('[AI Help] 成功提取到数据，filled=true');
              continue;
            }
          } catch (e) {
            console.warn('[AI Help] 解析事件失败:', e, 'payload:', payload);
            // ignore
          }
        }
      }
      
      if (!filled) {
        console.warn('[AI Help] 未从工作流中提取到文案数据');
      }
      
      return filled; // 返回是否成功提取到数据
    } catch (e) {
      console.error('[AI Help] 文案优化工作流失败:', e);
      return false; // 失败时返回 false
    }
  };

  // 根据选择的背景图与介绍模版，决定是否叠加模版1的彩色UI
  React.useEffect(() => {
    if (selectedSellingTemplate !== 'sp1' || !selectedBackground) {
      setTemplateOverlaySrc('');
      return;
    }
    // 解析背景图编号
    let bgIdx = null;
    const m = String(selectedBackground).match(/\/背景图\/(\d+)\.png$/);
    if (m && m[1]) bgIdx = parseInt(m[1], 10);

    let overlay = '';
    // 合并“之前规则 + 你的修改”：
    // 绿：1/2/5（替换原 1/2/3）
    // 橙：3/6（保留）
    // 蓝：4/9（保留）
    // 红：7（替换原 6）
    // 紫：8（替换原 7）
    const base = import.meta.env.BASE_URL;
    if (bgIdx === 7) overlay = base + '介绍模版/模版1/红.png';
    else if (bgIdx === 4 || bgIdx === 9) overlay = base + '介绍模版/模版1/蓝.png';
    else if (bgIdx === 8) overlay = base + '介绍模版/模版1/紫.png';
    else if (bgIdx === 3 || bgIdx === 6) overlay = base + '介绍模版/模版1/橙.png';
    else if (bgIdx === 1 || bgIdx === 2 || bgIdx === 5) overlay = base + '介绍模版/模版1/绿.png';

    setTemplateOverlaySrc(overlay);
  }, [selectedSellingTemplate, selectedBackground]);

  // 说明：预览区仅展示商品图（或生成结果首图），不再捕获整张编辑画布


  // 模拟工作流API调用
  const callCozeWorkflow = async () => {
    console.log('[Generate] click, isGenerating=', isGenerating, 'uploadedImage=', !!uploadedImage);
    if (!uploadedImage) {
      alert('请先上传商品图片');
      return;
    }

    setIsGenerating(true);
    setIsDemoGenerating(true);
    gotFinalRef.current = false;
    console.log('开始调用 Coze 工作流，参数:', workflowParams);
    
    try {
      // 切到结果页 + 先渲染加载占位
      setMiddleTabValue('generateResult');
      setGeneratedImages(['', '', '', '']); // 改为空字符串数组，避免对象问题

      // 将 dataURL 转为可访问的 http 链接（工作流的 Image 类型通常不接受 base64）
      let imageUrlToSend = uploadedImage; // 可为 http(s) 链接
      let imageFileId = null; // Coze 文件直传返回的 file_id
      if (typeof uploadedImage === 'string' && uploadedImage.startsWith('data:')) {
        try {
          // 优先上传到 Coze 文件接口，拿到 Coze 可访问的 URL
          const up = await fetch('http://127.0.0.1:8788/api/coze/file_upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: uploadedImage })
          });
          const upJson = await up.json();
          // Coze 可能返回的字段：url / data.url / file_url / data.file_url
          const tryGetUrl =
            upJson?.url ||
            upJson?.data?.url ||
            upJson?.file_url ||
            upJson?.data?.file_url ||
            upJson?.data?.file?.url ||
            null;
          if (up.ok && tryGetUrl) imageUrlToSend = tryGetUrl;
          // 如果返回 file_id（无直接 URL），记录 file_id，后续以 file_id 方式传参
          if (up.ok && upJson?.data?.id && !tryGetUrl) {
            imageFileId = String(upJson.data.id);
          }
          // 如果返回里没有 URL，则回退到本地静态上传
          if (!imageUrlToSend) {
            const localUp = await fetch('http://127.0.0.1:8788/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl: uploadedImage })
            });
            const localJson = await localUp.json();
            if (localUp.ok && localJson.url) imageUrlToSend = localJson.url;
          }
        } catch (e) {
          console.warn('本地上传失败，将直接把 dataURL 传给工作流（可能被拒绝）', e);
        }
      }

      // 1. 计算背景图序号：选中的背景图编号
      let bgSeq = '5';
      if (selectedBackground && typeof selectedBackground === 'string') {
        const m = selectedBackground.match(/\/背景图\/(\d+)\.png$/);
        if (m && m[1]) bgSeq = String(m[1]);
      }

      // 2. 计算 jieshao：选中产品介绍模板且文案输入完整时为1，否则为0
      const hasSellingTemplate = selectedSellingTemplate !== null;
      const hasCompleteSellingText = !!(workflowParams.pinpai1?.trim() && 
        workflowParams.zhuzhi1?.trim() && 
        workflowParams.zhuzhi2?.trim() && 
        workflowParams.md1?.trim() && 
        workflowParams.md2?.trim());
      const jieshaoVal = hasSellingTemplate && hasCompleteSellingText ? '1' : '0';

      // 3. 计算 k_gj：促销模板1=k，模板2=gj，模板3=&，未选中=0
      let k_gjVal = '0';
      if (selectedMarketingTemplate === 'mb1') k_gjVal = 'k';
      else if (selectedMarketingTemplate === 'mb2') k_gjVal = 'gj';
      else if (selectedMarketingTemplate === 'mb3') k_gjVal = '&';

      // 发起到本地代理服务
      // 注意：代理端口改为 8788，且使用 127.0.0.1 避免某些环境下 localhost 解析问题
      const resp = await fetch('http://127.0.0.1:8788/api/coze/stream_run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow_id: '7551679058410324009',
          app_id: '7551624988181921855',
          parameters: {
            bg: bgSeq,
            // 模板2活动名
            gj_hdm: workflowParams.gj_hdm || '',
            // 促销模板选择：'k'（模板1）、'gj'（模板2）、'&'（模板3）、'0'（未选中）
            k_gj: k_gjVal,
            // 促销模板1相关字段
            k_jiage: workflowParams.k_jiage || '',
            k_md: workflowParams.k_md || '',
            k_hdm: workflowParams.k_hdm || '',
            // Coze Image 类型可以是 http 链接或文件 id
            image: imageFileId ? { file_id: imageFileId } : imageUrlToSend,
            jieshao: jieshaoVal,
            // 产品介绍文案：直接抓取对应输入文案
            pinpai1: workflowParams.pinpai1 || '',
            zhuzhi1: workflowParams.zhuzhi1 || '',
            zhuzhi2: workflowParams.zhuzhi2 || '',
            md1: workflowParams.md1 || '',
            md2: workflowParams.md2 || '',
          },
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error('工作流请求失败');
      }

      // 递归提取对象中的所有图片链接（http 开头的字符串）
      const extractImageUrls = (node, bucket = []) => {
        if (!node) return bucket;
        if (typeof node === 'string') {
          const s = node.trim();
          // 如果字符串是 JSON（如工作流把链接放在 content 的 JSON 字符串里），尝试解析再递归
          if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
            try {
              const parsed = JSON.parse(s);
              return extractImageUrls(parsed, bucket);
            } catch {}
          }
          if (/^https?:\/\//i.test(s)) bucket.push(s);
          return bucket;
        }
        if (Array.isArray(node)) {
          for (const it of node) extractImageUrls(it, bucket);
          return bucket;
        }
        if (typeof node === 'object') {
          for (const k of Object.keys(node)) extractImageUrls(node[k], bucket);
          return bucket;
        }
        return bucket;
      };

      const contentType = resp.headers.get('content-type') || '';

      const reader = resp.body?.getReader ? resp.body.getReader() : null;
      const decoder = new TextDecoder();
      let buffer = '';
      let finalImages = null;

      if (contentType.includes('application/json') && !reader) {
        // 非流式：一次性 JSON
        const obj = await resp.json();
        const candidates = [obj];
        let urls = [];
        for (const c of candidates) {
          extractImageUrls(c, urls);
        }
        // 只保留看起来像图片的链接，排除 debug_url
        const isLikelyImage = (u) => {
          // 排除调试页面 URL
          if (/work_flow|execute_id|debug/i.test(u)) return false;
          // 只保留：1) 有图片扩展名 2) Coze 短链 s.coze.cn/t/
          return /\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(u) || /^https?:\/\/s\.coze\.cn\/t\//i.test(u);
        };
        const filtered = urls.filter(isLikelyImage);
        if (filtered.length) {
          const proxied = filtered.slice(0, 4).map(u => (/^https?:\/\/s\.coze\.cn\/t\//i.test(u) ? `http://127.0.0.1:8788/api/proxy_image?u=${encodeURIComponent(u)}` : u));
          console.log('Workflow images (json, raw):', filtered);
          console.log('Workflow images (json, proxied):', proxied);
          finalImages = proxied;
          setGeneratedImages(finalImages);
          gotFinalRef.current = true;
          setIsDemoGenerating(false);
        }
      } else if (reader) {
        // 流式：SSE 或分段 JSON
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // 流结束：如果还没有解析到图片，保持加载状态，等待后端补图或重试
            if (!finalImages) {
              console.warn('流结束但未解析到图片，继续保持加载状态');
            }
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';
          for (const chunk of parts) {
            // 兼容两种：`data: {...}` 或 直接 `{...}`
            const maybeLine = chunk.split('\n').find(l => l.trim().startsWith('data:')) || chunk;
            const payload = maybeLine.trim().startsWith('data:') ? maybeLine.trim().slice(5).trim() : maybeLine.trim();
            if (!payload || payload === '[DONE]') continue;
            try {
              const evt = JSON.parse(payload);
              
              // 检查是否是 Done 事件
              if (evt?.event === 'Done' || evt?.node_type === 'End' || evt?.node_is_finish === true) {
                console.log('工作流完成事件:', evt);
                // 如果还没有解析到图片，检查 content 字段
                if (!finalImages && evt?.content) {
                  try {
                    const contentParsed = typeof evt.content === 'string' ? JSON.parse(evt.content) : evt.content;
                    const output = contentParsed?.output;
                    if (Array.isArray(output)) {
                      let urls = [];
                      extractImageUrls(output, urls);
                      const isLikelyImage = (u) => {
                        if (/work_flow|execute_id|debug/i.test(u)) return false;
                        return /\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(u) || /^https?:\/\/s\.coze\.cn\/t\//i.test(u);
                      };
                      const filtered = urls.filter(isLikelyImage);
                      if (filtered.length) {
                        const proxied = filtered.slice(0, 4).map(u => (/^https?:\/\/s\.coze\.cn\/t\//i.test(u) ? `http://127.0.0.1:8788/api/proxy_image?u=${encodeURIComponent(u)}` : u));
                        console.log('Workflow images (from Done event):', proxied);
                        finalImages = proxied;
                        setGeneratedImages(finalImages);
                        // 默认选中第一张图片展示到预览区
                        if (finalImages.length > 0 && finalImages[0]) {
                          const firstImageSrc = typeof finalImages[0] === 'string' ? finalImages[0] : (finalImages[0]?.url || '');
                          if (firstImageSrc && firstImageSrc.trim() !== '') {
                            setSelectedGeneratedImage(firstImageSrc);
                            console.log('[Generate] 默认选中第一张图片 (Done event):', firstImageSrc);
                          }
                        }
                        gotFinalRef.current = true;
                        setIsDemoGenerating(false);
                      }
                    }
                  } catch (parseErr) {
                    console.warn('解析 Done 事件的 content 失败:', parseErr);
                  }
                }
                // 如果 Done 事件但没有图片，也关闭加载状态
                if (!finalImages) {
                  console.warn('工作流已完成但未解析到图片');
                  gotFinalRef.current = true;
                  setIsDemoGenerating(false);
                }
                continue;
              }
              
            // 已知可能字段（兼容不同工作流的输出结构）
            const candidates = [
              evt?.images,
              evt?.result?.images,
              evt?.data?.images,
              evt?.data?.image_urls,
              evt?.output?.images,
              evt?.output,
            ].filter(Boolean);

            let urls = [];
            for (const c of candidates) {
              extractImageUrls(c, urls);
            }
            if (!urls.length) {
              // 兜底：深度遍历整个事件对象拉取可能的图片链接
              urls = extractImageUrls(evt, []);
            }
            // 只保留看起来像图片的链接，排除 debug_url（包含 work_flow 或 execute_id）
            const isLikelyImage = (u) => {
              // 排除调试页面 URL
              if (/work_flow|execute_id|debug/i.test(u)) return false;
              // 只保留：1) 有图片扩展名 2) Coze 短链 s.coze.cn/t/
              return /\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(u) || /^https?:\/\/s\.coze\.cn\/t\//i.test(u);
            };
            const filtered = urls.filter(isLikelyImage);
            if (filtered.length) {
              // 取前 4 张图
              const proxied = filtered.slice(0, 4).map(u => (/^https?:\/\/s\.coze\.cn\/t\//i.test(u) ? `http://127.0.0.1:8788/api/proxy_image?u=${encodeURIComponent(u)}` : u));
              console.log('Workflow images (sse, raw):', filtered);
              console.log('Workflow images (sse, proxied):', proxied);
              finalImages = proxied;
              setGeneratedImages(finalImages);
              // 默认选中第一张图片展示到预览区
              if (finalImages.length > 0 && finalImages[0] && !selectedGeneratedImage) {
                const firstImageSrc = typeof finalImages[0] === 'string' ? finalImages[0] : (finalImages[0]?.url || '');
                if (firstImageSrc && firstImageSrc.trim() !== '') {
                  setSelectedGeneratedImage(firstImageSrc);
                  console.log('[Generate] 默认选中第一张图片:', firstImageSrc);
                }
              }
              gotFinalRef.current = true;
              setIsDemoGenerating(false);
            }
            } catch (e) {
              // 非 JSON 行，忽略
            }
          }
        }
      } else {
        // 既不是 application/json，也拿不到 reader：退化为读取 text 再整体解析
        const text = await resp.text();
        const blocks = text.split('\n\n').filter(Boolean);
        for (const blk of blocks) {
          const payload = blk.trim().replace(/^data:\s*/,'');
          try {
            const evt = JSON.parse(payload);
            let urls = extractImageUrls(evt, []);
            // 只保留看起来像图片的链接，排除 debug_url
            const isLikelyImage = (u) => {
              // 排除调试页面 URL
              if (/work_flow|execute_id|debug/i.test(u)) return false;
              // 只保留：1) 有图片扩展名 2) Coze 短链 s.coze.cn/t/
              return /\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(u) || /^https?:\/\/s\.coze\.cn\/t\//i.test(u);
            };
            const filtered = urls.filter(isLikelyImage);
            if (filtered.length) {
              const proxied = filtered.slice(0, 4).map(u => (/^https?:\/\/s\.coze\.cn\/t\//i.test(u) ? `http://127.0.0.1:8788/api/proxy_image?u=${encodeURIComponent(u)}` : u));
              console.log('Workflow images (fallback, raw):', filtered);
              console.log('Workflow images (fallback, proxied):', proxied);
              finalImages = proxied;
              setGeneratedImages(finalImages);
              break;
            }
          } catch {}
        }
      }

      // 若流中未携带图片，留在占位或提示
      if (!finalImages) {
        console.warn('未解析到图片结果');
      }
      setGenerationTime(new Date());
    } catch (error) {
      console.error('Coze 工作流失败:', error);
      // 工作流失败时，清空生成结果
      gotFinalRef.current = true;
      setIsDemoGenerating(false);
      setGeneratedImages([]);
    } finally {
      setIsGenerating(false);
      // 仅当已经拿到结果时再关闭“生成中”动画；否则保持加载态（等待后台继续产生结果）
      if (gotFinalRef.current) setIsDemoGenerating(false);
    }
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 1px;
            transition: background 0.2s ease;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: #D1D5DB;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9CA3AF;
          }
        `}
      </style>
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/页面背景图.png)',
          backgroundPosition: 'top center',
          backgroundAttachment: 'fixed'
        }}
      >
      {/* 顶部导航 */}
      <div className="h-[52px] bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-800">药划算商品图优化工具</h1>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex gap-6">
          {/* 左侧输入区域 */}
          <div className="w-[338px] flex-shrink-0">
            <Card 
              className="border-0 h-[808px]"
              style={{
                borderRadius: '30px',
                background: 'linear-gradient(180deg, #FFFFFF 31%, #FFFFFF 100%)',
                border: '1px solid #FFFFFF'
              }}
            >
              <div className="flex flex-col h-full" style={{ padding: '20px 12px 20px 20px' }}>
                <div 
                  className="flex-1 overflow-y-auto custom-scrollbar"
                  style={{ display: 'flex', flexDirection: 'column', gap: '42px' }}
                >
                  {/* Step1: 上传商品图片 */}
                  <div>
                    <div className="flex items-center mb-4">
                      <img src={`${import.meta.env.BASE_URL}step1.png`} alt="Step1" className="w-[173px] h-[29px]" />
                      <span 
                        className="ml-2"
                        style={{ 
                          fontSize: '12px', 
                          color: 'rgba(17, 25, 37, 0.3)' 
                        }}
                      >
                        上传图片将自动抠图
                      </span>
                    </div>
                    <ImageUploader 
                      onImageUpload={handleImageUpload}
                      uploadedImage={uploadedImage}
                      isCuttingOut={isCuttingOut}
                    />
                  </div>

                  {/* Step2: 选择优化内容 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <img src={`${import.meta.env.BASE_URL}step2.png`} alt="Step2" className="w-[173px] h-[29px]" />
                    </div>
                    <Tabs defaultValue="background" className="w-full">
                      <TabsList className="flex w-full items-center h-[50px] justify-start bg-white">
                        <TabsTrigger 
                          value="background" 
                          className="relative px-0 mr-6 text-gray-500 font-normal data-[state=active]:text-[#111925] data-[state=active]:font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent after:absolute after:content-[''] after:w-8 after:h-[3px] after:bg-transparent after:rounded-full after:left-1/2 after:-translate-x-1/2 after:bottom-0 data-[state=active]:after:bg-[#111925]"
                          style={{ fontSize: '16px', boxShadow: 'none' }}
                        >
                          加背景氛围
                        </TabsTrigger>
                        <TabsTrigger 
                          value="sellingPoint" 
                          className="relative px-0 mr-6 text-gray-500 font-normal data-[state=active]:text-[#111925] data-[state=active]:font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent after:absolute after:content-[''] after:w-8 after:h-[3px] after:bg-transparent after:rounded-full after:left-1/2 after:-translate-x-1/2 after:bottom-0 data-[state=active]:after:bg-[#111925]"
                          style={{ fontSize: '16px', boxShadow: 'none' }}
                        >
                          加产品介绍
                        </TabsTrigger>
                        <TabsTrigger 
                          value="marketingBox" 
                          className="relative px-0 text-gray-500 font-normal data-[state=active]:text-[#111925] data-[state=active]:font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent after:absolute after:content-[''] after:w-8 after:h-[3px] after:bg-transparent after:rounded-full after:left-1/2 after:-translate-x-1/2 after:bottom-0 data-[state=active]:after:bg-[#111925]"
                          style={{ fontSize: '16px', boxShadow: 'none' }}
                        >
                          加促销信息
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="background" className="mt-2">
                        <BackgroundSelector 
                          onBackgroundSelect={handleBackgroundSelect}
                          selectedBackground={selectedBackground}
                          setCanvasDisplayImage={setCanvasDisplayImage}
                        />
                      </TabsContent>
                      
                      <TabsContent value="sellingPoint" className="mt-2">
                        <SellingPointSelector 
                          onSettingsChange={handleSettingsChange}
                          workflowParams={workflowParams}
                          setWorkflowParams={setWorkflowParams}
                          setCanvasDisplayImage={setCanvasDisplayImage}
                          onTemplateChange={setSelectedSellingTemplate}
                          onCommitField={(field, value) => setWorkflowParams(prev => ({...prev, [field]: value}))}
                          onAIHelp={async () => { 
                            return await callCopyOptimizeWorkflow(); 
                          }}
                        />
                      </TabsContent>
                      
                      <TabsContent value="marketingBox" className="mt-2">
                        <MarketingBoxSelector 
                          onSettingsChange={handleSettingsChange}
                          workflowParams={workflowParams}
                          setWorkflowParams={setWorkflowParams}
                          onTemplateChange={(templateId) => {
                            setSelectedMarketingTemplate(templateId);
                            // 同步更新 workflowParams.k_gj（但实际调用工作流时会用 selectedMarketingTemplate 计算）
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                
                {/* 吸底生成按钮 */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
                  <button 
                    type="button"
                    onClick={callCozeWorkflow}
                    disabled={isGenerating || !uploadedImage}
                    className="w-full h-12 rounded-full border-none cursor-pointer disabled:cursor-not-allowed relative overflow-hidden"
                    style={{
                      background: 'none',
                      border: 'none'
                    }}
                  >
                    <img 
                      src={isGenerating || !uploadedImage ? `${import.meta.env.BASE_URL}按钮-置灰.png` : `${import.meta.env.BASE_URL}按钮-激活.png`} 
                      alt="生成图片" 
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* 中间编辑区域 - 包含左侧画布和右侧预览 */}
          <div className="flex-1">
            <Tabs value={middleTabValue} onValueChange={setMiddleTabValue} className="w-full">
              {/* 标签栏 - 覆盖整个编辑区域 */}
              <Card 
                className="w-full mb-0"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(180deg, #FFFFFF 31%, #FFFFFF 100%)',
                  border: '1px solid #FFFFFF'
                }}
              >
                <TabsList className="w-full h-[50px] rounded-[16px] bg-transparent justify-start">
                  <TabsTrigger 
                    value="editCanvas" 
                    className="text-gray-500 font-normal data-[state=active]:text-[#111925] data-[state=active]:font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:bg-transparent after:rounded-full data-[state=active]:after:bg-[#111925]"
                    style={{ fontSize: '18px', boxShadow: 'none' }}
                  >
                    编辑画布
                  </TabsTrigger>
                  <TabsTrigger 
                    value="generateResult" 
                    className="text-gray-500 font-normal data-[state=active]:text-[#111925] data-[state=active]:font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:bg-transparent after:rounded-full data-[state=active]:after:bg-[#111925]"
                    style={{ fontSize: '18px', boxShadow: 'none' }}
                  >
                    生成结果
                  </TabsTrigger>
                </TabsList>
              </Card>

              {/* 编辑画布内容 */}
              <TabsContent value="editCanvas" className="mt-6">
                <div className="flex gap-6">
                  {/* 左侧画布区域 */}
                  <div className="flex-1 flex justify-center">
                  <div 
                    ref={canvasRef}
                    className="w-[500px] h-[500px] max-w-full rounded-lg overflow-hidden"
                  >
                    {uploadedImage ? (
                      <div 
                        className="w-full h-full relative flex items-center justify-center rounded-lg"
                        style={{
                          backgroundImage: selectedBackground ? `url(${selectedBackground})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: selectedBackground ? 'transparent' : '#fff'
                        }}
                      >
                        {/* 文案可编辑预览，仅模板1时显示；全部居中对齐并限制长度 */}
                        {selectedSellingTemplate === 'sp1' && (
                          <>
                            {/* 品牌名称 */}
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="absolute text-center flex items-center justify-center"
                              style={{
                                top: '153px',
                                right: '71px',
                                width: '94px',
                                height: '18px',
                                fontSize: '18px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                zIndex: 4,
                                lineHeight: '18px'
                              }}
                              onCompositionStart={() => (composingRef.current = true)}
                              onCompositionEnd={() => (composingRef.current = false)}
                              onInput={handleCanvasInput('pinpai1')}
                              onBlur={handleCanvasBlur('pinpai1')}
                            >
                              {(workflowParams.pinpai1 || '').slice(0,5) || '品牌名称'}
                            </div>

                            {/* 主文案1 */}
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="absolute text-center flex items-center justify-center"
                              style={{
                                top: '200px',
                                right: '38px',
                                width: '160px',
                                height: '34px',
                                fontSize: '32px',
                                fontWeight: 800,
                                color: '#111111',
                                zIndex: 4,
                                lineHeight: '34px'
                              }}
                              onCompositionStart={() => (composingRef.current = true)}
                              onCompositionEnd={() => (composingRef.current = false)}
                              onInput={handleCanvasInput('zhuzhi1')}
                              onBlur={handleCanvasBlur('zhuzhi1')}
                            >
                              {(workflowParams.zhuzhi1 || '').slice(0,5) || '主文案1'}
                            </div>

                            {/* 主文案2 */}
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="absolute text-center flex items-center justify-center"
                              style={{
                                top: '248px',
                                right: '38px',
                                width: '160px',
                                height: '34px',
                                fontSize: '32px',
                                fontWeight: 800,
                                color: '#111111',
                                zIndex: 4,
                                lineHeight: '34px'
                              }}
                              onCompositionStart={() => (composingRef.current = true)}
                              onCompositionEnd={() => (composingRef.current = false)}
                              onInput={handleCanvasInput('zhuzhi2')}
                              onBlur={handleCanvasBlur('zhuzhi2')}
                            >
                              {(workflowParams.zhuzhi2 || '').slice(0,5) || '主文案2'}
                            </div>

                            {/* 副文案1 */}
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="absolute text-center flex items-center justify-center"
                              style={{
                                top: '308px',
                                right: '54px',
                                width: '128px',
                                height: '20px',
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                zIndex: 4,
                                lineHeight: '20px'
                              }}
                              onCompositionStart={() => (composingRef.current = true)}
                              onCompositionEnd={() => (composingRef.current = false)}
                              onInput={handleCanvasInput('md1')}
                              onBlur={handleCanvasBlur('md1')}
                            >
                              {(workflowParams.md1 || '').slice(0,6) || '副文案1'}
                            </div>

                            {/* 副文案2 */}
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="absolute text-center flex items-center justify-center"
                              style={{
                                top: '362px',
                                right: '54px',
                                width: '128px',
                                height: '20px',
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                zIndex: 4,
                                lineHeight: '20px'
                              }}
                              onCompositionStart={() => (composingRef.current = true)}
                              onCompositionEnd={() => (composingRef.current = false)}
                              onInput={handleCanvasInput('md2')}
                              onBlur={handleCanvasBlur('md2')}
                            >
                              {(workflowParams.md2 || '').slice(0,6) || '副文案2'}
                            </div>
                          </>
                        )}
                        {/* 模版1彩色UI叠加（覆盖画布，置于最上层） */}
                        {templateOverlaySrc && (
                          <img
                            src={templateOverlaySrc}
                            alt="模版UI"
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{ zIndex: 3 }}
                          />
                        )}
                        <img 
                          src={uploadedImage} 
                          alt="上传的商品图片" 
                          className={
                            selectedSellingTemplate === 'sp1'
                              ? "absolute left-8 top-1/2 -translate-y-1/2 max-w-[40%] max-h-[40%] object-contain"
                              : selectedBackground
                                ? "max-w-[50%] max-h-[50%] object-contain"
                                : "max-w-full max-h-full object-contain rounded-lg"
                          }
                          style={{
                            zIndex: selectedSellingTemplate === 'sp1' ? 2 : (selectedBackground ? 2 : 'auto')
                          }}
                        />
                      </div>
                    ) : selectedBackground ? (
                      <div 
                        className="w-full h-full rounded-lg"
                        style={{
                          backgroundImage: `url(${selectedBackground})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ) : (
                      <div className="bg-white rounded-lg w-full h-full flex items-center justify-center text-center text-gray-400">
                        <p>请先上传商品图片</p>
                      </div>
                    )}
                    </div>
                  </div>
                  
                  {/* 右侧预览区域 */}
                  <div className="w-[300px] flex-shrink-0">
                    <div className="h-[650px]">
                      <div className="flex justify-center items-center mb-[14px]">
                        <img src={`${import.meta.env.BASE_URL}预览标题.png`} alt="实机预览" className="h-6" />
                      </div>
                      <div className="flex justify-center items-center">
                        <PhoneFrame>
                          <ProductPreview image={uploadedImage} selectedGeneratedImage={selectedGeneratedImage} />
                      <ProductPreview image={uploadedImage} selectedGeneratedImage={selectedGeneratedImage} />
                        </PhoneFrame>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 生成结果内容 */}
              <TabsContent value="generateResult" className="mt-6">
                <div className="flex gap-6">
                  {/* 左侧生成结果区域 */}
                  <div className="flex-1 relative z-[1000] pointer-events-auto">
                <div className="space-y-4">
                  {/* 用户信息 */}
                  <div className="flex items-center gap-3 mb-4">
                    <img src={avatarImg} alt="头像" className="w-8 h-8 rounded-full" />
                    <div>
                          <p className="font-medium">药划算商品图优化</p>
                      <p className="text-sm text-gray-500">
                        {generationTime ? generationTime.toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }) : '刚刚'}
                      </p>
                    </div>
                  </div>
                  
                  {/* 生成结果图片 */}
                  {(isGenerating || isDemoGenerating || (generatedImages.length > 0 && generatedImages.some(img => {
                    const imgSrc = typeof img === 'string' ? img : (img?.url || '');
                    return imgSrc && imgSrc.trim() !== '';
                  }))) ? (
                    <ResultPreview
                      images={isGenerating || isDemoGenerating ? ['', '', '', ''] : generatedImages}
                      onRegenerate={handleRegenerate}
                      showProductPreview={false}
                      onImageSelect={setSelectedGeneratedImage}
                      isDemoGenerating={isGenerating || isDemoGenerating}
                    />
                  ) : (
                    <div className="text-center text-gray-400 py-16">
                      <p className="text-lg">暂无生成图片</p>
                      <p className="text-sm mt-2">请点击"生成图片"按钮开始生成</p>
                    </div>
                  )}
                </div>
          </div>

                  {/* 右侧预览区域 */}
                  <div className="w-[300px] flex-shrink-0">
                    <div className="h-[650px]">
                      <div className="flex justify-center items-center mb-[14px]">
                        <img src={`${import.meta.env.BASE_URL}预览标题.png`} alt="实机预览" className="h-6" />
                  </div>
                  <div className="flex justify-center items-center">
                    <PhoneFrame>
                      <ProductPreview image={uploadedImage} selectedGeneratedImage={selectedGeneratedImage} />
                    </PhoneFrame>
                  </div>
                </div>
            </div>
        </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default Index;
