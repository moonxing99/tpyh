import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TextTemplateSelector = ({ onTextChange }) => {
  return (
    <Card className="w-full bg-white/30 backdrop-blur-md border-0 shadow-lg mt-4">
      <CardHeader>
        <CardTitle className="text-lg">文案编辑</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">商品标题</label>
            <Input
              placeholder="输入商品标题"
              onChange={(e) => onTextChange('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">商品描述</label>
            <Textarea
              placeholder="输入商品描述"
              onChange={(e) => onTextChange('description', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextTemplateSelector;
