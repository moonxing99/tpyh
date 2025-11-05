import React from 'react';
const frameImg = import.meta.env.BASE_URL + '样机.png';

const PhoneFrame = ({ children }) => {
  return (
    <div className="relative mx-auto" style={{ width: '300px', height: '650px' }}>
      {/* 屏幕内容区域：居中放置，尺寸与内部屏幕匹配（位于下层） */}
      <div className="absolute inset-0 z-[10] flex items-center justify-center">
        <div className="w-[300px] h-[650px] relative rounded-[32px] overflow-hidden bg-transparent">
          {children}
        </div>
      </div>

      {/* 样机外框置于最上层 */}
      <img 
        src={frameImg} 
        alt="样机外框" 
        className="absolute inset-0 z-[100] w-full h-full object-cover select-none pointer-events-none" 
      />
    </div>
  );
};

export default PhoneFrame;
