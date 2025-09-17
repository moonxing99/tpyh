import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from 'lucide-react';

const ResultPreview = ({ image, onRegenerate }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'generated-image.png';
    link.click();
  };

  return (
    <Card className="w-full h-full bg-white/30 backdrop-blur-md border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col h-full gap-4">
          <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden bg-gray-100">
            {image ? (
              <img src={image} alt="预览" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                预览区域
              </div>
            )}
          </div>
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
              disabled={!image}
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
