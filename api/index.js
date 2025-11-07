// Vercel Serverless Function 入口
// 直接导入并导出 server/index.js 的 Express app
// Vercel 会自动识别并处理 Express app
import app from '../server/index.js';

export default app;

