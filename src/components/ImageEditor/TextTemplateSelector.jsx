import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TextTemplateSelector = ({ onTextChange }) => {
  const handleSymptomChange = (index, value) => {
    // 限制输入5个字
    const limitedValue = value.slice(0, 5);
    onTextChange(`symptom${index + 1}`, limitedValue);
  };

  return (
    <Card className="w-full bg-white/30 backdrop-blur-md border-0 shadow-lg mt-4">
      <CardHeader>
        <CardTitle className="text-lg">文案编辑</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">药品品牌</label>
            <Input
              placeholder="输入药品品牌"
              onChange={(e) => onTextChange('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">主治症状</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <div>
                <Input
                  placeholder="症状1（限5字）"
                  maxLength={5}
                  onChange={(e) => handleSymptomChange(0, e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Input
                  placeholder="症状2（限5字）"
                  maxLength={5}
                  onChange={(e) => handleSymptomChange(1, e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextTemplateSelector;
