// Vercel Serverless Function 入口
// 导入 Express app
import app from '../server/index.js';

// Vercel 需要导出 handler 函数
// 对于 Express app，直接导出 app 即可，Vercel 会自动处理
export default app;

