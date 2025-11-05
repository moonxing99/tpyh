
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardContent, Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
const starIcon = import.meta.env.BASE_URL + '星星.png';

const BackgroundSelector = ({ onBackgroundSelect, selectedBackground, setCanvasDisplayImage }) => {
  const backgroundCategories = [
    { id: 'smartRecommend', name: '智能推荐', icon: starIcon },
    { id: 'all', name: '全部' },
    { id: 'platform', name: '台面底台' },
    { id: 'outdoor', name: '户外实景' },
    { id: 'simple', name: '简约抽象' },
    { id: 'plant', name: '植物景观' }
  ];

  const base = import.meta.env.BASE_URL;
  const backgrounds = [
    { id: 1, category: 'platform', url: base + '背景图/1.png' },
    { id: 2, category: 'outdoor', url: base + '背景图/2.png' },
    { id: 3, category: 'simple', url: base + '背景图/3.png' },
    { id: 4, category: 'plant', url: base + '背景图/4.png' },
    { id: 5, category: 'platform', url: base + '背景图/5.png' },
    { id: 6, category: 'outdoor', url: base + '背景图/6.png' },
    { id: 7, category: 'simple', url: base + '背景图/7.png' },
    { id: 8, category: 'plant', url: base + '背景图/8.png' },
    { id: 9, category: 'platform', url: base + '背景图/9.png' }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredBackgrounds = React.useMemo(() => {
    if (selectedCategory === 'smartRecommend') {
      // 智能推荐：随机选择3张图片
      const shuffled = [...backgrounds].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    } else if (selectedCategory === 'all') {
      return backgrounds;
    } else {
      return backgrounds.filter(bg => bg.category === selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* 分类选择 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {backgroundCategories.map(category => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center justify-center rounded-full text-sm px-3 border transition-colors duration-200 h-[30px]",
                selectedCategory === category.id
                  ? "bg-[#F3F5FF] border-[#6684FF] text-[#0027C2] font-medium hover:bg-[#F3F5FF] hover:border-[#6684FF] hover:text-[#0027C2]"
                  : "bg-white border-[#DCDDDF] text-[#111925] font-normal hover:bg-[#F3F5FF] hover:border-[#6684FF] hover:text-[#0027C2] hover:font-medium"
              )}
            >
              {category.icon && <img src={category.icon} alt={category.name} className="w-4 h-4 mr-2" />}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* 背景图片网格 */}
        <ScrollArea className="h-[420px]">
          <div className="grid grid-cols-3 gap-[10px]">
            {filteredBackgrounds.map((bg) => (
              <div
                key={bg.id}
                className={cn(
                  "relative cursor-pointer rounded-[10px] overflow-hidden w-[92px] h-[92px] transition-all",
                  selectedBackground === bg.url 
                    ? "border border-[#6684FF]" 
                    : "border border-transparent"
                )}
                onClick={() => {
                  onBackgroundSelect(bg.url);
                }}
              >
                <img
                  src={bg.url}
                  alt={`背景 ${bg.id}`}
                  className="w-full h-full object-cover"
                />
                {/* 勾选标识 */}
                {selectedBackground === bg.url && (
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#6684FF] rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BackgroundSelector;
