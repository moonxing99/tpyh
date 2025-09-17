import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from 'lucide-react';

const ProductPreview = ({ image }) => {
  return (
    <ScrollArea className="h-[500px] w-full rounded-lg">
      <div className="bg-white">
        {/* 商品主图 */}
        <div className="relative w-full aspect-square">
          {image ? (
            <img
              src={image}
              alt="商品主图"
              className="w-full h-full object-contain mx-auto"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              请上传商品图片
            </div>
          )}
          {/* 618特惠标签 */}
          <div className="absolute left-4 top-4">
            <img 
              src="https://nocode.meituan.com/photo/search?keyword=618,sale,tag&width=64&height=64" 
              alt="618特惠"
              className="w-16 h-16 object-contain"
            />
          </div>
          {/* 页码指示器 */}
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 rounded text-white text-xs">
            1/5
          </div>
        </div>

        {/* 价格区域 */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4">
          <div className="flex items-baseline">
            <span className="text-sm text-red-600">¥</span>
            <span className="text-3xl font-bold text-red-600">23.9</span>
            <span className="ml-2 text-sm text-gray-500 line-through">¥32.46</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-xs text-red-600 border border-red-600 rounded-sm">
              限时优惠
            </span>
            <span className="px-2 py-0.5 text-xs text-red-600 border border-red-600 rounded-sm">
              首单包邮
            </span>
          </div>
        </div>

        {/* 商品标题 */}
        <div className="p-4 border-b">
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 text-sm bg-orange-100 text-orange-600 rounded flex-shrink-0">
              精选
            </span>
            <h1 className="text-lg font-medium leading-tight">
              [NYO3]澳洲天然鱼油OMEGA-3/100粒
            </h1>
          </div>
        </div>

        {/* 用药说明 */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">用药说明</div>
              <div className="text-xs text-gray-500 mt-1">每日1-2次</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">功能主治</div>
              <div className="text-xs text-gray-500 mt-1">调节血脂</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">使用方法</div>
              <div className="text-xs text-gray-500 mt-1">口服</div>
            </div>
          </div>
        </div>

        {/* 配送信息 */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>快递：免运费</span>
            <span>预计1-3日送达</span>
          </div>
        </div>

        {/* 服务信息 */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded">药品保障</span>
            <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded">正品承诺</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">隐私配送</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">药师服务</span>
          </div>
        </div>

        {/* 底部购买栏 */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center gap-3">
          <Button variant="outline" size="icon" className="flex-none">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="flex-1 bg-gray-800 text-white hover:bg-gray-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            加入购物车
          </Button>
          <Button className="flex-1 bg-red-600 text-white hover:bg-red-700">
            立即购买
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ProductPreview;
