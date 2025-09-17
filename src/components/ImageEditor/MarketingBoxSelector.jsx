import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MarketingBoxSelector = ({ onSettingsChange }) => {
  const templateImages = [
    { id: 'mb1', name: '促销风格', preview: 'https://nocode.meituan.com/photo/search?keyword=sale,promotion&width=100&height=60' },
    { id: 'mb2', name: '节日风格', preview: 'https://nocode.meituan.com/photo/search?keyword=festival,celebration&width=100&height=60' },
    { id: 'mb3', name: '限时风格', preview: 'https://nocode.meituan.com/photo/search?keyword=limited,time&width=100&height=60' },
  ];

  return (
    <Card className="w-full bg-white/30 backdrop-blur-md border-0 shadow-lg mt-4">
      <CardHeader>
        <CardTitle className="text-lg">加营销框</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>选择营销框模板</Label>
            <RadioGroup
              onValueChange={(value) => onSettingsChange('marketingBox', { template: value })}
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
            <Label>营销文案</Label>
            <Input
              placeholder="输入营销标语（限25字）"
              maxLength={25}
              onChange={(e) => onSettingsChange('marketingBox', { mainText: e.target.value })}
            />
            <Input
              placeholder="输入促销信息（限20字）"
              maxLength={20}
              onChange={(e) => onSettingsChange('marketingBox', { subText: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingBoxSelector;
