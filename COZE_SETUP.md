# Coze工作流集成设置

## 配置步骤

1. **获取Coze API密钥**
   - 登录 [Coze平台](https://www.coze.cn/)
   - 在开发者设置中创建API密钥
   - 复制API密钥

2. **获取工作流ID**
   - 在Coze平台中创建或选择您的工作流
   - 从工作流URL或设置中获取工作流ID

3. **配置API信息**
   - 打开 `src/config/coze.js` 文件
   - 替换 `YOUR_COZE_API_KEY` 为您的实际API密钥
   - 替换 `YOUR_WORKFLOW_ID` 为您的工作流ID

## 工作流参数

当前工作流会接收以下参数：
- `product_image`: 上传的商品图片URL
- `background`: 选择的背景图片URL
- `settings`: 用户设置（卖点、营销框等）

## 工作流输出格式

工作流应该返回包含图片URL数组的JSON数据，格式如下：
```json
{
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
    "https://example.com/image4.jpg"
  ]
}
```

## 使用说明

1. 上传商品图片
2. 选择背景和设置选项
3. 点击"生成图片"按钮
4. 系统会调用Coze工作流生成图片
5. 生成的图片会显示在结果区域

## 注意事项

- 确保API密钥有足够的工作流调用权限
- 工作流需要能够处理图片生成任务
- 建议设置合理的超时时间
- 生产环境中建议使用环境变量存储敏感信息
