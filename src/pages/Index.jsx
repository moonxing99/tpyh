import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from '../components/ImageEditor/ImageUploader';
import BackgroundSelector from '../components/ImageEditor/BackgroundSelector';
import SellingPointSelector from '../components/ImageEditor/SellingPointSelector';
import MarketingBoxSelector from '../components/ImageEditor/MarketingBoxSelector';
import ResultPreview from '../components/ImageEditor/ResultPreview';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [settings, setSettings] = useState({
    sellingPoint: {},
    marketingBox: {}
  });

  const handleImageUpload = (image) => {
    setUploadedImage(image);
  };

  const handleBackgroundSelect = (backgroundUrl) => {
    setSelectedBackground(backgroundUrl);
  };

  const handleSettingsChange = (section, updates) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const handleRegenerate = () => {
    // 重新生成图片的逻辑
    console.log('Regenerating with settings:', { selectedBackground, settings });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">AIGC 图片生成器</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧编辑区域 */}
          <div className="space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="background">加背景图</TabsTrigger>
                <TabsTrigger value="sellingPoint">加卖点</TabsTrigger>
                <TabsTrigger value="marketingBox">加营销框</TabsTrigger>
              </TabsList>
              
              <TabsContent value="background">
                <BackgroundSelector
                  onBackgroundSelect={handleBackgroundSelect}
                  selectedBackground={selectedBackground}
                />
              </TabsContent>
              
              <TabsContent value="sellingPoint">
                <SellingPointSelector onSettingsChange={handleSettingsChange} />
              </TabsContent>
              
              <TabsContent value="marketingBox">
                <MarketingBoxSelector onSettingsChange={handleSettingsChange} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* 右侧预览区域 */}
          <div className="h-full">
            <ResultPreview
              image={uploadedImage}
              background={selectedBackground}
              settings={settings}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
