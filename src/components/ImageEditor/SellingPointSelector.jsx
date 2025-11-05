
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
const starIcon = import.meta.env.BASE_URL + '星星.png';
const whiteStarIcon = import.meta.env.BASE_URL + '星星-白.png';

const SellingPointSelector = ({ onSettingsChange, workflowParams, setWorkflowParams, setCanvasDisplayImage, onTemplateChange, onCommitField, onAIHelp }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 添加旋转动画样式
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ai-help-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .ai-help-spinner {
        animation: ai-help-spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const base = import.meta.env.BASE_URL;
  const templateImages = [
    { id: 'sp1', name: '样式1', preview: base + '介绍模版/1.png', recommended: true },
    { id: 'sp2', name: '样式2', preview: base + '介绍模版/2.png', recommended: true },
    { id: 'sp3', name: '样式3', preview: base + '介绍模版/3.png', recommended: false },
  ];

  const handleAIHelp = async () => {
    setIsThinking(true);
    setErrorMessage(null);
    setShowRecommendation(false);
    
    // 通知父组件AI帮写被点击，并等待工作流完成
    let workflowSuccess = false;
    try {
      if (onAIHelp && typeof onAIHelp === 'function') {
        const result = await onAIHelp();
        // 如果工作流返回 true，表示成功提取到数据
        workflowSuccess = result === true;
      }
    } catch (err) {
      console.error('AI help workflow failed:', err);
      workflowSuccess = false;
    }
    
    // 工作流完成后关闭思考状态
    setIsThinking(false);
    
    if (workflowSuccess) {
      setShowRecommendation(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('好像出了一些问题，请重试～');
      setShowRecommendation(false);
    }
  };

  const handleCommit = (field) => (e) => {
    if (typeof onCommitField === 'function') {
      onCommitField(field, (workflowParams?.[field] || '').trim());
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* 介绍模版 */}
        <div>
          <Label className="font-medium" style={{ fontSize: '16px' }}>介绍模版</Label>
          <div className="grid grid-cols-3 gap-3 mt-3">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 介绍文案 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="font-medium" style={{ fontSize: '16px' }}>介绍文案</Label>
                        <Button 
                          className="flex items-center gap-[2px] rounded-full bg-[#F6F7FF] text-[#0027C2] text-xs font-normal hover:bg-[#F6F7FF] hover:text-[#0027C2]"
                          style={{ width: '65px', height: '24px' }}
                          onClick={handleAIHelp}
                          disabled={isThinking}
                        >
                          {isThinking ? (
                            <svg 
                              className="w-3 h-3 ai-help-spinner" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                              style={{ color: '#0027C2' }}
                            >
                              <circle 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="#0027C2" 
                                strokeOpacity="0.25"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path 
                                fill="#0027C2"
                                fillOpacity="0.75"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <img src={starIcon} alt="星星" className="w-3 h-3" />
                          )}
                          AI帮写
                        </Button>
          </div>

          {/* 品牌名称 */}
          <div className="mb-4">
            <Label style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(17, 25, 37, 0.65)' }}>品牌名称</Label>
            <Input
              placeholder="输入品牌名称"
              value={workflowParams.pinpai1}
              onChange={(e) => setWorkflowParams({...workflowParams, pinpai1: e.target.value.slice(0,5)})}
              maxLength={5}
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
                handleCommit('pinpai1')(e);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCommit('pinpai1')(e); }}
            />
          </div>

          {/* 主文案 */}
          <div className="mb-4">
            <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(17, 25, 37, 0.65)' }}>主文案(核心功效、目标人群等)</Label>
              {(isThinking || showRecommendation) && <img src={starIcon} alt="星星" className="w-3 h-3" />}
            </div>
            {(isThinking || showRecommendation || errorMessage) && (
              <p className="text-xs" style={{ color: errorMessage ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 39, 194, 0.3)', marginBottom: '8px' }}>
                {isThinking ? '思考中...' : errorMessage || '根据历史上线数据和智能分析为你推荐文案'}
              </p>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="输入主文案1"
                value={workflowParams.zhuzhi1}
                onChange={(e) => setWorkflowParams({...workflowParams, zhuzhi1: e.target.value.slice(0,5)})}
                maxLength={5}
                disabled={!selectedTemplate}
                className="w-[144px] focus:ring-0 focus:outline-none focus:shadow-none"
                style={{ 
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
                  handleCommit('zhuzhi1')(e);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCommit('zhuzhi1')(e); }}
              />
              <Input
                placeholder="输入主文案2"
                value={workflowParams.zhuzhi2}
                onChange={(e) => setWorkflowParams({...workflowParams, zhuzhi2: e.target.value.slice(0,5)})}
                maxLength={5}
                disabled={!selectedTemplate}
                className="w-[144px] focus:ring-0 focus:outline-none focus:shadow-none"
                style={{ 
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
                  handleCommit('zhuzhi2')(e);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCommit('zhuzhi2')(e); }}
              />
            </div>
          </div>

          {/* 副文案 */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <Label style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(17, 25, 37, 0.65)' }}>副文案(功效、指标等)</Label>
              {(isThinking || showRecommendation) && <img src={starIcon} alt="星星" className="w-3 h-3" />}
            </div>
            {(isThinking || showRecommendation || errorMessage) && (
              <p className="text-xs" style={{ color: errorMessage ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 39, 194, 0.3)', marginBottom: '8px' }}>
                {isThinking ? '思考中...' : errorMessage || '根据历史上线数据和智能分析为你推荐文案'}
              </p>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="输入副文案1"
                value={workflowParams.md1}
                onChange={(e) => setWorkflowParams({...workflowParams, md1: e.target.value.slice(0,6)})}
                maxLength={6}
                disabled={!selectedTemplate}
                className="w-[144px] focus:ring-0 focus:outline-none focus:shadow-none"
                style={{ 
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
                  handleCommit('md1')(e);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCommit('md1')(e); }}
              />
              <Input
                placeholder="输入副文案2"
                value={workflowParams.md2}
                onChange={(e) => setWorkflowParams({...workflowParams, md2: e.target.value.slice(0,6)})}
                maxLength={6}
                disabled={!selectedTemplate}
                className="w-[144px] focus:ring-0 focus:outline-none focus:shadow-none"
                style={{ 
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
                  handleCommit('md2')(e);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCommit('md2')(e); }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellingPointSelector;
