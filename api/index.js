// Vercel Serverless Function 入口
// 导入并重新导出 Express app
// Vercel 的 @vercel/node 构建器会自动识别 Express app
import app from '../server/index.js';

// 直接导出 Express app，Vercel 会自动处理
export default app;

