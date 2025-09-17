import React, { useState } from 'react';
import ImageUploader from '../components/ImageEditor/ImageUploader';
import BackgroundSelector from '../components/ImageEditor/BackgroundSelector';
import ResultPreview from '../components/ImageEditor/ResultPreview';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);

  const handleImageUpload = (image) => {
    setUploadedImage(image);
  };

  const handleBackgroundSelect = (backgroundUrl) => {
    setSelectedBackground(backgroundUrl);
  };

  const handleRegenerate = () => {
    // 重新生成图片的逻辑
    console.log('Regenerating with background:', selectedBackground);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">AIGC 图片生成器</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧编辑区域 */}
          <div className="space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} />
            <BackgroundSelector
              onBackgroundSelect={handleBackgroundSelect}
              selectedBackground={selectedBackground}
            />
          </div>
          
          {/* 右侧预览区域 */}
          <div className="h-full">
            <ResultPreview
              image={uploadedImage}
              background={selectedBackground}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
