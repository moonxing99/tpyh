import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';

const ProductPreview = ({ image }) => {
  return (
    <ScrollArea className="h-[600px]">
      <div className="bg-white">
        {/* 商品主图 */}
        <div className="w-full aspect-square relative">
          {image ? (
            <img
              src={image}
              alt="商品主图"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              请上传商品图片
            </div>
          )}
          {/* 618特惠标签 */}
          <div className="absolute left-2 top-2 w-20 h-20">
            <img 
              src="https://nocode.meituan.com/photo/search?keyword=618,sale,tag&width=80&height=80" 
              alt="618特惠"
              className="w-full h-full object-contain"
            />
          </div>
          {/* 页码指示器 */}
          <div className="absolute bottom-4 right-4 text-sm text-gray-500">
            2/5
          </div>
        </div>

        {/* 价格区域 */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4">
          <div className="flex items-baseline">
            <span className="text-sm text-red-600">到手 ¥</span>
            <span className="text-3xl font-bold text-red-600">23.9</span>
            <span className="ml-2 text-sm text-gray-500 line-through">¥32.46</span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            药划算已省20.1元
          </div>
          <div className="mt-2 flex gap-2">
            <span className="px-2 py-0.5 text-xs text-red-600 border border-red-600 rounded-sm">
              活动补贴2.4元
            </span>
            <span className="px-2 py-0.5 text-xs text-red-600 border border-red-600 rounded-sm">
              首单包邮
            </span>
          </div>
        </div>

        {/* 商品标题 */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-sm bg-orange-100 text-orange-600 rounded">精选</span>
            <h1 className="text-lg font-medium">
              [NYO3]澳洲天然鱼油OMEGA-3/100粒
            </h1>
          </div>
        </div>

        {/* 用药说明 */}
        <div className="px-4">
          <div className="grid grid-cols-3 border rounded-lg">
            <div className="p-3 text-center border-r">
              <div className="text-sm font-medium">用药说明</div>
            </div>
            <div className="p-3 text-center border-r">
              <div className="text-sm font-medium">功能主治</div>
              <div className="text-xs text-gray-500 mt-1">清畅血管，调节血脂</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-sm font-medium">常用用法</div>
              <div className="text-xs text-gray-500 mt-1">口服，一次10ml</div>
            </div>
          </div>
        </div>

        {/* 配送信息 */}
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-4">快递：快递发货</span>
            <span>预计1-3日送达·包邮</span>
          </div>
        </div>

        {/* 服务信息 */}
        <div className="px-4 pb-20">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded">药划算·常备药保险</span>
            <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded">买药直接报销</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">不瘦必赔</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">买贵必赔</span>
          </div>
        </div>

        {/* 底部购买栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex items-center gap-2">
          <Button variant="outline" className="flex-1 bg-gray-800 text-white hover:bg-gray-700">
            加入购物车
          </Button>
          <Button className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500">
            立即购买
            <span className="ml-1">¥5.24</span>
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ProductPreview;
