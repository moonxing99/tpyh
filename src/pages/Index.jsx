import React, { useState } from 'react';
import ImageUploader from '../components/ImageEditor/ImageUploader';
import BackgroundSelector from '../components/ImageEditor/BackgroundSelector';
import TextTemplateSelector from '../components/ImageEditor/TextTemplateSelector';
import ResultPreview from '../components/ImageEditor/ResultPreview';

const Index = () => {
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleImageUpload = (image) => {
    setGeneratedImage(image);
  };

  const handleBackgroundSelect = (background) => {
    // 这里可以添加背景处理逻辑
    console.log('Selected background:', background);
  };

  const handleTextChange = (type, text) => {
    // 这里可以添加文本处理逻辑
    console.log('Text changed:', type, text);
  };

  const handleRegenerate = () => {
    // 这里可以添加重新生成逻辑
    console.log('Regenerating image...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">AIGC 图片生成器</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧编辑区域 */}
          <div className="space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} />
            <BackgroundSelector onBackgroundSelect={handleBackgroundSelect} />
            <TextTemplateSelector onTextChange={handleTextChange} />
          </div>
          
          {/* 右侧预览区域 */}
          <div className="h-full">
            <ResultPreview
              image={generatedImage}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
