import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const backgrounds = [
  { id: 1, url: 'https://nocode.meituan.com/photo/search?keyword=modern,minimal,background&width=100&height=100' },
  { id: 2, url: 'https://nocode.meituan.com/photo/search?keyword=nature,background&width=100&height=100' },
  { id: 3, url: 'https://nocode.meituan.com/photo/search?keyword=abstract,background&width=100&height=100' },
  { id: 4, url: 'https://nocode.meituan.com/photo/search?keyword=gradient,background&width=100&height=100' },
];

const BackgroundSelector = ({ onBackgroundSelect }) => {
  return (
    <Card className="w-full bg-white/30 backdrop-blur-md border-0 shadow-lg mt-4">
      <CardHeader>
        <CardTitle className="text-lg">选择背景</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32">
          <div className="grid grid-cols-3 gap-4">
            {backgrounds.map((bg) => (
              <div
                key={bg.id}
                className="relative cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => onBackgroundSelect(bg.url)}
              >
                <img
                  src={bg.url}
                  alt={`背景 ${bg.id}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BackgroundSelector;
