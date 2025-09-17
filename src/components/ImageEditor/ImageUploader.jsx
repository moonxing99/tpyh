
import { CardContent, Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
const ImageUploader = ({ onImageUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-[2px] border border-gray-100/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="image-upload" className="w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-all">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">点击上传商品图片</p>
              <p className="text-xs text-gray-500">支持 JPG, PNG 格式</p>
            </div>
          </label>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
