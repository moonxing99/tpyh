
import { CardContent, Card } from '@/components/ui/card';
import { RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
const ResultPreview = ({ image, onRegenerate, showProductPreview = true }) => {
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

  return (
    <Card className="w-full bg-white/80 backdrop-blur-[2px] border border-gray-100/20 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 2x2 网格布局展示四张图片 */}
          <div className="grid grid-cols-2 gap-4">
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
                  alt={`生成图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-end">
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
