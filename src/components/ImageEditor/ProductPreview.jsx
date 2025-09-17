import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProductPreview = ({ image }) => {
  return (
    <ScrollArea className="h-[500px]">
      <div className="bg-white">
        {/* 商品主图 */}
        <div className="w-full aspect-square relative">
          {image ? (
            <img
              src={image}
              alt="商品主图"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              请上传商品图片
            </div>
          )}
        </div>

        {/* 商品信息 */}
        <div className="p-4">
          <div className="text-2xl font-bold text-red-600">¥ 299.00</div>
          <h1 className="text-lg font-medium mt-2">
            [限时特惠] 高品质商品名称展示 - 2024新款上市
          </h1>
          
          {/* 促销信息 */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded">限时优惠</span>
              <span className="px-2 py-1 text-sm text-orange-600 border border-orange-600 rounded">赠品</span>
            </div>
            <div className="text-sm text-gray-500">
              优惠说明：全场满299减50，限时特惠不容错过
            </div>
          </div>

          {/* 商品描述 */}
          <div className="mt-6 space-y-4">
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>✨ 产品特点：</p>
              <p>• 优质材料，精工制作</p>
              <p>• 时尚美观，实用耐用</p>
              <p>• 多种款式可选，满足不同需求</p>
            </div>
            
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>🎁 购买即赠：</p>
              <p>• 精美包装</p>
              <p>• 保养说明书</p>
              <p>• 专属优惠券</p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ProductPreview;
