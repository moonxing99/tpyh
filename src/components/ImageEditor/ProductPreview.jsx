import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from 'lucide-react';

const ProductPreview = ({ image }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden" style={{ maxWidth: '375px' }}>
      {/* 商品主图 - 使用 16:9 的宽高比 */}
      <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
        <div className="absolute inset-0">
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
          {/* 618特惠标签 */}
          <div className="absolute left-2 top-2">
            <img 
              src="https://nocode.meituan.com/photo/search?keyword=618,sale,tag&width=40&height=40" 
              alt="618特惠"
              className="w-10 h-10 object-contain"
            />
          </div>
          {/* 页码指示器 */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 rounded text-white text-xs">
            1/5
          </div>
        </div>
      </div>

      {/* 价格区域 */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3">
        <div className="flex items-baseline">
          <span className="text-sm text-red-600">¥</span>
          <span className="text-2xl font-bold text-red-600">23.9</span>
          <span className="ml-2 text-xs text-gray-500 line-through">¥32.46</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          <span className="px-1.5 py-0.5 text-xs text-red-600 border border-red-600 rounded-sm">
            限时优惠
          </span>
          <span className="px-1.5 py-0.5 text-xs text-red-600 border border-red-600 rounded-sm">
            首单包邮
          </span>
        </div>
      </div>

      {/* 商品标题 */}
      <div className="p-3 border-b">
        <div className="flex items-start gap-2">
          <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded flex-shrink-0">
            精选
          </span>
          <h1 className="text-sm font-medium leading-tight">
            [NYO3]澳洲天然鱼油OMEGA-3/100粒
          </h1>
        </div>
      </div>

      {/* 用药说明 */}
      <div className="p-3 border-b">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium">用药说明</div>
            <div className="text-xs text-gray-500 mt-0.5">每日1-2次</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium">功能主治</div>
            <div className="text-xs text-gray-500 mt-0.5">调节血脂</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium">使用方法</div>
            <div className="text-xs text-gray-500 mt-0.5">口服</div>
          </div>
        </div>
      </div>

      {/* 配送信息 */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>快递：免运费</span>
          <span>预计1-3日送达</span>
        </div>
      </div>

      {/* 服务信息 */}
      <div className="p-3 border-b">
        <div className="flex flex-wrap gap-1">
          <span className="px-1.5 py-0.5 text-xs bg-green-50 text-green-600 rounded">药品保障</span>
          <span className="px-1.5 py-0.5 text-xs bg-green-50 text-green-600 rounded">正品承诺</span>
          <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">隐私配送</span>
          <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">药师服务</span>
        </div>
      </div>

      {/* 底部购买栏 */}
      <div className="bg-white border-t p-3 flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="h-9 flex-1 bg-gray-800 text-white hover:bg-gray-700">
          <ShoppingCart className="h-4 w-4 mr-1" />
          加入购物车
        </Button>
        <Button className="h-9 flex-1 bg-red-600 text-white hover:bg-red-700">
          立即购买
        </Button>
      </div>
    </div>
  );
};

export default ProductPreview;
