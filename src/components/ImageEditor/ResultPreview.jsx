
import { CardContent, Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import ProductPreview from './ProductPreview';
import { Button } from '@/components/ui/button';
const ResultPreview = ({ image, onRegenerate }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 生成4张不同的1:1比例图片URL
  const generatedImages = [
    'https://nocode.meituan.com/photo/search?keyword=medicine,health,product&width=400&height=400',
    'https://nocode.meituan.com/photo/search?keyword=pharmacy,wellness,supplement&width=400&height=400',
    'https://nocode.meituan.com/photo/search?keyword=healthcare,natural,organic&width=400&height=400',
    'https://nocode.meituan.com/photo/search?keyword=medical,treatment,care&width=400&height=400'
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImages[selectedImageIndex];
    link.download = `generated-image-${selectedImageIndex + 1}.png`;
    link.click();
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : generatedImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < generatedImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <Card className="w-full h-full bg-white/30 backdrop-blur-md border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col h-full gap-4">
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">图片预览</TabsTrigger>
              <TabsTrigger value="product">商品详情</TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="mt-4">
              <div className="space-y-4">
                {/* 主预览图 - 使用正方形容器 */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={generatedImages[selectedImageIndex]} 
                    alt={`预览图 ${selectedImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 缩略图预览 - 使用正方形容器 */}
                <div className="grid grid-cols-4 gap-2">
                  {generatedImages.map((img, index) => (
                    <div
                      key={index}
                      className={cn(
                        "cursor-pointer rounded-lg overflow-hidden border-2 aspect-square",
                        selectedImageIndex === index ? "border-blue-500" : "border-transparent"
                      )}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`缩略图 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="product" className="mt-4">
              <div className="w-[360px] mx-auto">
                <ProductPreview image={generatedImages[selectedImageIndex]} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 justify-end mt-auto">
            <Button
              variant="outline"
              onClick={onRegenerate}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              重新生成
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              下载图片
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultPreview;
