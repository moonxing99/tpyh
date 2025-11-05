import React from 'react';
const screenImg = import.meta.env.BASE_URL + '界面模拟图.png';

const ProductPreview = ({ image, selectedGeneratedImage }) => {
  // 优先显示选中的生成图片；没有则显示上传/抠图后的商品图片
  const displayImage = selectedGeneratedImage || image;
  
  return (
    <div className="relative" style={{ width: '300px', height: '650px', maxWidth: '100%' }}>
      {/* 商品主图占位区域（灰色区） - 下层 */}
      <div 
        className="absolute left-0 right-0 z-[10]" 
        style={{ 
          top: '0px', 
          height: '288px',
          backgroundColor: '#F3F3F4',
          borderRadius: '54px 54px 0 0'
        }}
      >
        {displayImage ? (
          <img 
            src={displayImage} 
            alt="商品主图" 
            className="w-full h-full object-contain" 
            style={{ borderRadius: '54px 54px 0 0' }}
            decoding="async"
            fetchpriority="high"
            width={300}
            height={288}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ borderRadius: '54px 54px 0 0' }}>请上传商品图片</div>
        )}
      </div>

      {/* 整屏背景图置于上层作为样机界面遮罩*/}
      <img src={screenImg} alt="样机屏幕" className="absolute inset-0 w-full h-full object-cover z-[50] pointer-events-none select-none" />

      {/* 其余文案与UI交由样机图承载，这里不再渲染多余信息 */}
    </div>
  );
};

export default ProductPreview;
