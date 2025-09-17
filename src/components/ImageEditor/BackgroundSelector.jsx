
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardContent, Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
const BackgroundSelector = ({ onBackgroundSelect, selectedBackground }) => {
  const backgroundCategories = [
    { id: 'all', name: '全部' },
    { id: 'platform', name: '台面底台' },
    { id: 'outdoor', name: '户外实景' },
    { id: 'simple', name: '简约抽象' },
    { id: 'plant', name: '植物景观' }
  ];

  const backgrounds = [
    { id: 1, category: 'platform', url: 'https://nocode.meituan.com/photo/search?keyword=modern,minimal,platform&width=120&height=120' },
    { id: 2, category: 'outdoor', url: 'https://nocode.meituan.com/photo/search?keyword=outdoor,scenery&width=120&height=120' },
    { id: 3, category: 'simple', url: 'https://nocode.meituan.com/photo/search?keyword=abstract,minimal&width=120&height=120' },
    { id: 4, category: 'plant', url: 'https://nocode.meituan.com/photo/search?keyword=plant,green&width=120&height=120' },
    { id: 5, category: 'platform', url: 'https://nocode.meituan.com/photo/search?keyword=table,surface&width=120&height=120' },
    { id: 6, category: 'outdoor', url: 'https://nocode.meituan.com/photo/search?keyword=nature,landscape&width=120&height=120' },
    { id: 7, category: 'simple', url: 'https://nocode.meituan.com/photo/search?keyword=geometric,simple&width=120&height=120' },
    { id: 8, category: 'plant', url: 'https://nocode.meituan.com/photo/search?keyword=flower,leaf&width=120&height=120' },
    { id: 9, category: 'platform', url: 'https://nocode.meituan.com/photo/search?keyword=desk,surface&width=120&height=120' },
    { id: 10, category: 'outdoor', url: 'https://nocode.meituan.com/photo/search?keyword=garden,park&width=120&height=120' },
    { id: 11, category: 'simple', url: 'https://nocode.meituan.com/photo/search?keyword=pattern,minimal&width=120&height=120' },
    { id: 12, category: 'plant', url: 'https://nocode.meituan.com/photo/search?keyword=tropical,green&width=120&height=120' }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredBackgrounds = selectedCategory === 'all' 
    ? backgrounds 
    : backgrounds.filter(bg => bg.category === selectedCategory);

  return (
    <Card className="w-full bg-white/80 backdrop-blur-[2px] border border-gray-100/20 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 分类选择 */}
          <div className="flex flex-wrap gap-2">
            {backgroundCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-full",
                  selectedCategory === category.id && "bg-primary text-primary-foreground"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* 背景图片网格 */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-3 gap-4">
              {filteredBackgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className={cn(
                    "relative cursor-pointer rounded-lg overflow-hidden aspect-square hover:ring-2 hover:ring-blue-500 transition-all",
                    selectedBackground === bg.url && "ring-2 ring-blue-500"
                  )}
                  onClick={() => onBackgroundSelect(bg.url)}
                >
                  <img
                    src={bg.url}
                    alt={`背景 ${bg.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundSelector;
