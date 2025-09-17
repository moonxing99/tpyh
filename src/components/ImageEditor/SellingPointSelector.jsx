import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SellingPointSelector = ({ onSettingsChange }) => {
  const templateImages = [
    { id: 'sp1', name: '简约风格', preview: 'https://nocode.meituan.com/photo/search?keyword=minimal,clean,design&width=100&height=60' },
    { id: 'sp2', name: '医疗风格', preview: 'https://nocode.meituan.com/photo/search?keyword=medical,healthcare&width=100&height=60' },
    { id: 'sp3', name: '自然风格', preview: 'https://nocode.meituan.com/photo/search?keyword=natural,organic&width=100&height=60' },
  ];

  return (
    <Card className="w-full bg-white/30 backdrop-blur-md border-0 shadow-lg mt-4">
      <CardHeader>
        <CardTitle className="text-lg">加卖点</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>选择卖点模板</Label>
            <RadioGroup
              onValueChange={(value) => onSettingsChange('sellingPoint', { template: value })}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              {templateImages.map((template) => (
                <div key={template.id} className="relative">
                  <RadioGroupItem
                    value={template.id}
                    id={template.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={template.id}
                    className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted p-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent cursor-pointer"
                  >
                    <img src={template.preview} alt={template.name} className="w-full h-16 object-cover rounded" />
                    <span className="text-sm">{template.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>卖点文案</Label>
            <Input
              placeholder="输入主要卖点（限20字）"
              maxLength={20}
              onChange={(e) => onSettingsChange('sellingPoint', { mainText: e.target.value })}
            />
            <Input
              placeholder="输入次要卖点（限15字）"
              maxLength={15}
              onChange={(e) => onSettingsChange('sellingPoint', { subText: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellingPointSelector;
