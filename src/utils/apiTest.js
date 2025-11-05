// API测试工具
export const testCozeAPI = async () => {
  const COZE_CONFIG = {
    API_KEY: 'cztei_htmtf9D5pXyxFYieBWjqhTh9R25F5LwlW9aqgziX6fTRra5T79ntnfLBHcAOrWaPM',
    WORKFLOW_ID: '7551679058410324009',
    API_URL: 'https://api.coze.cn/v1/workflow/stream_run'
  };

  try {
    console.log('测试Coze API连接...');
    
    const response = await fetch(COZE_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COZE_CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        workflow_id: COZE_CONFIG.WORKFLOW_ID,
        parameters: {
          image: 'https://example.com/test.jpg',
          zhuzhi1: '测试主文案1',
          zhuzhi2: '测试主文案2',
          md1: '测试卖点1',
          md2: '测试卖点2',
          pinpai1: '测试品牌',
          k_gj: '框',
          k_jiage: '99元',
          k_md: '测试卖点',
          k_hdm: '测试活动',
          gj_hdm: '',
          jieshao: '是',
          ai: '是'
        }
      })
    });

    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    console.log('API响应:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('API测试失败:', error);
    return { success: false, error: error.message };
  }
};
