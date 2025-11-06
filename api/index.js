// Vercel Serverless Function 入口
// 直接导入并导出 server/index.js 的内容
import app from '../server/index.js';

// Vercel 需要导出 handler
export default app;

