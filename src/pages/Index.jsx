import ImageUploader from '../components/ImageEditor/ImageUploader';
import BackgroundSelector from '../components/ImageEditor/BackgroundSelector';
import { CardHeader, Card, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SellingPointSelector from '../components/ImageEditor/SellingPointSelector';
import ProductPreview from '../components/ImageEditor/ProductPreview';
import React, { useState } from 'react';
import MarketingBoxSelector from '../components/ImageEditor/MarketingBoxSelector';
import ResultPreview from '../components/ImageEditor/ResultPreview';
import PhoneFrame from '../components/ImageEditor/PhoneFrame';

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
        <div className="mx-auto px-6">
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
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 左侧编辑区域 - 58份宽度 */}
          <div className="w-[58fr]">
            <Card className="bg-white/80 backdrop-blur-[2px] border-0">
              <CardHeader>
                <CardTitle className="text-lg font-medium">编辑区域</CardTitle>
              </CardHeader>
              <div className="p-4 space-y-4">
                <ImageUploader onImageUpload={handleImageUpload} />
                
                <Tabs defaultValue="background" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/40 backdrop-blur-sm">
                    <TabsTrigger value="background">背景</TabsTrigger>
                    <TabsTrigger value="sellingPoint">卖点</TabsTrigger>
                    <TabsTrigger value="marketingBox">营销</TabsTrigger>
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
            </Card>
          </div>

          {/* 右侧预览区域 - 108份宽度 */}
          <div className="w-[108fr]">
            <Card className="bg-white/80 backdrop-blur-[2px] border-0">
              <div className="grid grid-cols-[1.5fr_1fr] h-full">
                {/* 左侧：生成图片预览 */}
                <div className="p-6 border-r border-dashed border-gray-200">
                  <CardHeader className="px-0">
                    <CardTitle className="text-lg font-medium">生成图片预览</CardTitle>
                  </CardHeader>
                  <ResultPreview
                    image={uploadedImage}
                    background={selectedBackground}
                    settings={settings}
                    onRegenerate={handleRegenerate}
                    showProductPreview={false}
                  />
                </div>
                
                {/* 右侧：商品详情预览 */}
                <div className="p-6">
                  <CardHeader className="px-0">
                    <CardTitle className="text-lg font-medium">商品详情预览</CardTitle>
                  </CardHeader>
                  <div className="mt-4">
                    <PhoneFrame>
                      <ProductPreview image={uploadedImage} />
                    </PhoneFrame>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
