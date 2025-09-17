import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const TemplateSelector = ({ onTemplateSelect, onSettingsChange }) => {
  const backgroundStyles = [
    { id: 'bg1', name: '简约渐变', preview: 'https://nocode.meituan.com/photo/search?keyword=gradient,minimal&width=100&height=60' },
    { id: 'bg2', name: '自然风光', preview: 'https://nocode.meituan.com/photo/search?keyword=nature,landscape&width=100&height=60' },
    { id: 'bg3', name: '抽象艺术', preview: 'https://nocode.meituan.com/photo/search?keyword=abstract,art&width=100&height=60' },
  ];

  const textStyles = [
    { id: 'text1', name: '简约白框', preview: 'https://nocode.meituan.com/photo/search?keyword=minimal,white,frame&width=100&height=60' },
    { id: 'text2', name: '渐变文框', preview: 'https://nocode.meituan.com/photo/search?keyword=gradient,frame&width=100&height=60' },
    { id: 'text3', name: '圆形标签', preview: 'https://nocode.meituan.com/photo/search?keyword=circle,label&width=100&height=60' },
  ];

  const promotionStyles = [
    { id: 'promo1', name: '大促标签', preview: 'https://nocode.meituan.com/photo/search?keyword=sale,tag&width=100&height=60' },
    { id: 'promo2', name: '折扣框', preview: 'https://nocode.meituan.com/photo/search?keyword=discount,frame&width=100&height=60' },
    { id: 'promo3', name: '优惠券', preview: 'https://nocode.meituan.com/photo/search?keyword=coupon&width=100&height=60' },
  ];

  return (
    <Card className="w-full bg-white/30 backdrop-blur-md border-0 shadow-lg mt-4">
      <CardHeader>
        <CardTitle className="text-lg">选择模板样式</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="background" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="background">加背景图</TabsTrigger>
            <TabsTrigger value="text">背景+文案</TabsTrigger>
            <TabsTrigger value="promotion">大促框</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="mt-4">
            <div className="space-y-4">
              <Label>选择背景样式</Label>
              <RadioGroup
                onValueChange={(value) => onSettingsChange('background', { style: value })}
                className="grid grid-cols-3 gap-4"
              >
                {backgroundStyles.map((style) => (
                  <div key={style.id} className="relative">
                    <RadioGroupItem
                      value={style.id}
                      id={style.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={style.id}
                      className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted p-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent cursor-pointer"
                    >
                      <img src={style.preview} alt={style.name} className="w-full h-16 object-cover rounded" />
                      <span className="text-sm">{style.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label>选择文案样式</Label>
                <RadioGroup
                  onValueChange={(value) => onSettingsChange('text', { style: value })}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {textStyles.map((style) => (
                    <div key={style.id} className="relative">
                      <RadioGroupItem
                        value={style.id}
                        id={style.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={style.id}
                        className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted p-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent cursor-pointer"
                      >
                        <img src={style.preview} alt={style.name} className="w-full h-16 object-cover rounded" />
                        <span className="text-sm">{style.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>文案内容</Label>
                <Input
                  placeholder="输入主标题"
                  onChange={(e) => onSettingsChange('text', { title: e.target.value })}
                />
                <Input
                  placeholder="输入副标题"
                  onChange={(e) => onSettingsChange('text', { subtitle: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="promotion" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label>选择大促框样式</Label>
                <RadioGroup
                  onValueChange={(value) => onSettingsChange('promotion', { style: value })}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {promotionStyles.map((style) => (
                    <div key={style.id} className="relative">
                      <RadioGroupItem
                        value={style.id}
                        id={style.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={style.id}
                        className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted p-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent cursor-pointer"
                      >
                        <img src={style.preview} alt={style.name} className="w-full h-16 object-cover rounded" />
                        <span className="text-sm">{style.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>促销文案</Label>
                <Input
                  placeholder="输入促销标语"
                  onChange={(e) => onSettingsChange('promotion', { text: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
