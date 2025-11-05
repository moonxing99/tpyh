
import { CardContent, Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
const ImageUploader = ({ onImageUpload, uploadedImage, isCuttingOut = false }) => {
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
    <div className="w-full">
      <div className="flex gap-3">
        {/* 已上传的图片缩略图 */}
        {uploadedImage && (
          <div className="relative w-[92px] h-[92px]">
            <img 
              src={uploadedImage} 
              alt="已上传商品图" 
              className="w-[92px] h-[92px] object-cover rounded-lg border border-gray-200"
              style={{ opacity: isCuttingOut ? 0.5 : 1 }}
            />
            {isCuttingOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
        
        {/* 上传按钮 */}
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="w-[92px] h-[92px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-all bg-gray-50">
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">上传图片</span>
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
    </div>
  );
};

export default ImageUploader;
