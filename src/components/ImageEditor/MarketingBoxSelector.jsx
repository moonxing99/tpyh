
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
const starIcon = import.meta.env.BASE_URL + '星星.png';
const whiteStarIcon = import.meta.env.BASE_URL + '星星-白.png';

const MarketingBoxSelector = ({ onSettingsChange, workflowParams, setWorkflowParams, onTemplateChange }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const base = import.meta.env.BASE_URL;
  const templateImages = [
    { id: 'mb1', name: '样式1', preview: base + '促销模版/促销模板3.png', recommended: true },
    { id: 'mb2', name: '样式2', preview: base + '促销模版/画板备份 2.png', recommended: true },
    { id: 'mb3', name: '样式3', preview: base + '促销模版/画板备份.png', recommended: false },
  ];

  const handleAIHelp = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setShowRecommendation(true);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* 促销模版 */}
        <div>
          <Label className="font-medium" style={{ fontSize: '16px' }}>促销模版</Label>
          <div className="grid grid-cols-3 gap-[10px] mt-3">
            {templateImages.map((template) => (
              <div key={template.id} className="relative">
                            <div
                              className={cn(
                                "relative cursor-pointer rounded-[10px] overflow-hidden w-[92px] h-[92px] transition-all",
                                selectedTemplate === template.id 
                                  ? "border border-[#6684FF]" 
                                  : "border border-transparent"
                              )}
                              onClick={() => {
                                const next = selectedTemplate === template.id ? null : template.id;
                                setSelectedTemplate(next);
                                if (onTemplateChange) onTemplateChange(next);
                              }}
                            >
                  <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                  {template.recommended && (
                    <div 
                      className="absolute top-1 left-1 flex items-center justify-center"
                      style={{
                        width: '44px',
                        height: '16px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '8px',
                        padding: '0 2px'
                      }}
                    >
                      <img src={whiteStarIcon} alt="星星" className="w-3 h-3 mr-0.5" />
                      <span 
                        className="text-white"
                        style={{
                          fontSize: '10px',
                          fontWeight: '400',
                          lineHeight: '1'
                        }}
                      >
                        推荐
                      </span>
                    </div>
                  )}
                  {/* 勾选标识 */}
                  {selectedTemplate === template.id && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#6684FF] rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {/* 智能AI生成水印 */}
                  <div className="absolute bottom-1 left-1 text-[8px] text-gray-400 opacity-50">
                    智能AI生成
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 促销文案 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="font-medium" style={{ fontSize: '16px' }}>促销文案</Label>
            <Button 
              className="flex items-center gap-[2px] rounded-full bg-[#F6F7FF] text-[#0027C2] text-xs font-normal hover:bg-[#F6F7FF] hover:text-[#0027C2]"
              style={{ width: '65px', height: '24px' }}
              onClick={handleAIHelp}
            >
              <img src={starIcon} alt="星星" className="w-3 h-3" />
              AI帮写
            </Button>
          </div>

          <div className="space-y-4">
            {/* 商品价格 */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(17, 25, 37, 0.65)' }}>商品价格 (元)</Label>
            <Input
              placeholder="输入商品价格"
              value={workflowParams.k_jiage || ''}
              onChange={(e) => setWorkflowParams({...workflowParams, k_jiage: e.target.value})}
              disabled={!selectedTemplate}
              className="focus:ring-0 focus:outline-none focus:shadow-none"
              style={{ 
                marginTop: '12px',
                borderWidth: '1px',
                borderColor: 'rgba(17, 25, 37, 0.15)',
                outline: 'none',
                boxShadow: 'none',
                opacity: selectedTemplate ? 1 : 0.5
              }}
              onFocus={(e) => {
                if (selectedTemplate) {
                  e.target.style.borderColor = '#166FF7';
                }
                e.target.style.outline = 'none';
                e.target.style.boxShadow = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(17, 25, 37, 0.15)';
                e.target.style.outline = 'none';
                e.target.style.boxShadow = 'none';
              }}
            />
            </div>

            {/* 活动名称 */}
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
                <Label style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(17, 25, 37, 0.65)' }}>活动名称</Label>
                {(isThinking || showRecommendation) && <img src={starIcon} alt="星星" className="w-3 h-3" />}
              </div>
              {(isThinking || showRecommendation) && (
                <p className="text-xs" style={{ color: 'rgba(0, 39, 194, 0.3)', marginBottom: '8px' }}>
                  {isThinking ? '思考中...' : '根据历史上线数据和智能分析为你推荐文案'}
                </p>
              )}
              <Input
                placeholder="输入活动名称"
                value={workflowParams.k_hdm || ''}
                onChange={(e) => setWorkflowParams({...workflowParams, k_hdm: e.target.value})}
                disabled={!selectedTemplate}
                className="focus:ring-0 focus:outline-none focus:shadow-none"
                style={{ 
                  marginTop: '12px',
                  borderWidth: '1px',
                  borderColor: 'rgba(17, 25, 37, 0.15)',
                  outline: 'none',
                  boxShadow: 'none',
                  opacity: selectedTemplate ? 1 : 0.5
                }}
                onFocus={(e) => {
                  if (selectedTemplate) {
                    e.target.style.borderColor = '#166FF7';
                  }
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(17, 25, 37, 0.15)';
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* 营销文案 */}
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
                <Label style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(17, 25, 37, 0.65)' }}>营销文案</Label>
                {(isThinking || showRecommendation) && <img src={starIcon} alt="星星" className="w-3 h-3" />}
              </div>
              {(isThinking || showRecommendation) && (
                <p className="text-xs" style={{ color: 'rgba(0, 39, 194, 0.3)', marginBottom: '8px' }}>
                  {isThinking ? '思考中...' : '根据历史上线数据和智能分析为你推荐文案'}
                </p>
              )}
              <Input
                placeholder="输入营销文案"
                value={workflowParams.k_md || ''}
                onChange={(e) => setWorkflowParams({...workflowParams, k_md: e.target.value})}
                disabled={!selectedTemplate}
                className="focus:ring-0 focus:outline-none focus:shadow-none"
                style={{ 
                  marginTop: '12px',
                  borderWidth: '1px',
                  borderColor: 'rgba(17, 25, 37, 0.15)',
                  outline: 'none',
                  boxShadow: 'none',
                  opacity: selectedTemplate ? 1 : 0.5
                }}
                onFocus={(e) => {
                  if (selectedTemplate) {
                    e.target.style.borderColor = '#166FF7';
                  }
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(17, 25, 37, 0.15)';
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingBoxSelector;
