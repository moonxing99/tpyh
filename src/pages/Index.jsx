
import ImageUploader from '../components/ImageEditor/ImageUploader';
import BackgroundSelector from '../components/ImageEditor/BackgroundSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SellingPointSelector from '../components/ImageEditor/SellingPointSelector';
import ProductPreview from '../components/ImageEditor/ProductPreview';
import React, { useState } from 'react';
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
    console.log('Regenerating with settings:', { selectedBackground, settings });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=ai,logo,modern&width=32&height=32" 
                alt="Logo" 
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI 图片生成器
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
          {/* 左侧编辑区域 */}
          <div className="space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/40 backdrop-blur-sm">
                <TabsTrigger value="background">背景</TabsTrigger>
                <TabsTrigger value="sellingPoint">背景+卖点信息</TabsTrigger>
                <TabsTrigger value="marketingBox">背景+营销信息</TabsTrigger>
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
          <div className="h-full lg:w-[800px]">
            <div className="grid grid-cols-2 gap-8">
              {/* 左侧：生成图片预览 */}
              <div className="space-y-4">
                <ResultPreview
                  image={uploadedImage}
                  background={selectedBackground}
                  settings={settings}
                  onRegenerate={handleRegenerate}
                  showProductPreview={false}
                />
              </div>
              
              {/* 右侧：商品详情预览 */}
              <div className="space-y-4">
                <div className="w-[360px] mx-auto">
                  <ProductPreview image={uploadedImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
