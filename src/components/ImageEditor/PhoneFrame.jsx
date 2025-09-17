import React from 'react';

const PhoneFrame = ({ children }) => {
  return (
    <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
      {/* 手机外壳 */}
      <div className="relative mx-auto bg-black rounded-[50px] p-3" style={{ maxWidth: '380px' }}>
        {/* 刘海区域 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[20px] flex items-center justify-center z-10">
          <div className="w-[80px] h-[10px] bg-black rounded-[20px] relative flex items-center">
            <div className="absolute left-[10px] w-[10px] h-[10px] rounded-full bg-[#1a1a1a]"></div>
            <div className="absolute right-[10px] w-[6px] h-[6px] rounded-full bg-[#1a1a1a]"></div>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="relative bg-white rounded-[40px] overflow-hidden">
          {/* 状态栏 */}
          <div className="absolute top-0 w-full h-[48px] bg-white z-10 flex items-center justify-between px-6">
            <div className="text-sm">9:41</div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path fill="currentColor" d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" />
                  <path fill="currentColor" d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3" />
                  <path fill="currentColor" d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9" />
                </svg>
              </div>
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path fill="currentColor" d="M2,22H22V2H2V22Z M20,20H4V4H20V20Z M6,18H18V6H6V18Z" />
                </svg>
              </div>
              <div className="w-6 h-3 bg-black rounded-sm relative">
                <div className="absolute right-0.5 top-0.5 bottom-0.5 w-4 bg-current rounded-sm"></div>
              </div>
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
