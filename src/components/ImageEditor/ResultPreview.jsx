import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import downloadIcon from '@/public/下载.png';
import previewIcon from '@/public/预览.png';
import dividerIcon from '@/public/悬浮操作分割线.png';

const ResultPreview = ({ images, onRegenerate, showProductPreview = true, onImageSelect, isDemoGenerating = false }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 如果没有传入images，使用默认的占位图片
  const generatedImages = images && images.length > 0 ? images : [
    'https://nocode.meituan.com/photo/search?keyword=medicine,health,product&width=400&height=400',
    'https://nocode.meituan.com/photo/search?keyword=pharmacy,wellness,supplement&width=400&height=400',
    'https://nocode.meituan.com/photo/search?keyword=healthcare,natural,organic&width=400&height=400',
    'https://nocode.meituan.com/photo/search?keyword=medical,treatment,care&width=400&height=400'
  ];

  const handleDownload = (idx) => {
    const link = document.createElement('a');
    link.href = generatedImages[idx];
    link.download = `generated-image-${idx + 1}.png`;
    link.click();
  };

  const handlePreview = (idx) => {
    window.open(generatedImages[idx], '_blank');
  };

  return (
    <div className="space-y-4">
      {/* 2x2 网格布局展示四张图片（每张234x234，间距10px） */}
      <div className="grid grid-cols-2 gap-[10px] w-[478px]">
        {generatedImages.map((img, index) => (
          <div
            key={index}
            className={cn(
              "group relative cursor-pointer overflow-hidden border-2 w-[234px] h-[234px]",
              selectedImageIndex === index ? "border-blue-500" : "border-transparent"
            )}
            style={{ borderRadius: '16px' }}
            onClick={() => {
              setSelectedImageIndex(index);
              if (onImageSelect) {
                onImageSelect(generatedImages[index]);
              }
            }}
          >
            {isDemoGenerating ? (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: '#DFE5EB' }}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (() => {
              const imgSrc = typeof img === 'string' ? img : (img?.url || '');
              if (!imgSrc) {
                return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span>暂无图片</span>
                  </div>
                );
              }
              return (
              <img
                  src={imgSrc}
                  alt={`生成图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="lazy"
                  decoding="async"
                  width={234}
                  height={234}
                  onLoad={(e) => {
                    try {
                      // 成功加载日志
                      console.log('Result image loaded:', e.currentTarget.src);
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.outline = '';
                    } catch {}
                  }}
                  onError={async (e) => {
                    try {
                      const target = e.currentTarget;
                      const currentSrc = target.src;
                      console.warn('Image load failed, src:', currentSrc);
                      
                      // 如果当前是 blob URL，说明已经尝试过 blob，直接标记失败
                      if (currentSrc.startsWith('blob:')) {
                        console.error('Blob URL also failed, marking as failed');
                        target.style.opacity = '0.3';
                        target.style.outline = '1px dashed #bbb';
                        // 清理 blob URL
                        URL.revokeObjectURL(currentSrc);
                        return;
                      }
                      
                      // 如果已经重试过（标记存在），不再重试
                      if (target.dataset.retry === '1') {
                        console.error('Image retry already attempted, marking as failed');
                        target.style.opacity = '0.3';
                        target.style.outline = '1px dashed #bbb';
                        return;
                      }
                      
                      // 标记已重试，然后用 fetch 转 blob 重试
                      target.dataset.retry = '1';
                      console.log('Retrying image load as blob, original src:', currentSrc);
                      
                      const resp = await fetch(currentSrc, { 
                        mode: 'cors',
                        credentials: 'omit'
                      });
                      
                      if (!resp.ok) {
                        console.error('Blob fetch failed, status:', resp.status, resp.statusText);
                        target.style.opacity = '0.3';
                        target.style.outline = '1px dashed #bbb';
                        return;
                      }
                      
                      const blob = await resp.blob();
                      console.log('Blob created, type:', blob.type, 'size:', blob.size);
                      
                      if (blob.size === 0 || !blob.type.startsWith('image/')) {
                        console.error('Blob is invalid:', blob.size, blob.type);
                        target.style.opacity = '0.3';
                        target.style.outline = '1px dashed #bbb';
                        return;
                      }
                      
                      const objUrl = URL.createObjectURL(blob);
                      console.log('Object URL created, setting as src:', objUrl);
                      target.src = objUrl;
                    } catch (err) {
                      console.error('Image error handler failed:', err, 'src:', e.currentTarget.src);
                      // 失败时不隐藏，方便观察布局
                      e.currentTarget.style.opacity = '0.3';
                      e.currentTarget.style.outline = '1px dashed #bbb';
                    }
                  }}
                />
              );
            })()}

            {/* 悬浮操作区 */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[10px] w-[70px] h-[24px] bg-black/50 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePreview(index); }}
                className="p-0.5 hover:opacity-90"
                aria-label="预览"
              >
                <img src={previewIcon} alt="预览" className="w-4 h-4" />
              </button>
              <img src={dividerIcon} alt="分割线" className="w-[1px] h-[10px]" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDownload(index); }}
                className="p-0.5 hover:opacity-90"
                aria-label="下载"
              >
                <img src={downloadIcon} alt="下载" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPreview;
