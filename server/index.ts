import { createServer } from 'node:http';
import { loadEnvFile } from 'node:process';
import { requestSchema, runAi } from './ai';

try { loadEnvFile('.env.local'); } catch { /* Environment variables may be supplied directly. */ }
let active = 0;
const server = createServer(async (req, res) => {
  const send = (status: number, body: unknown) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
  if (req.method === 'GET' && req.url === '/api/health') return send(200, { configured: !!process.env.GEMINI_API_KEY, provider: 'Gemini', model: process.env.GEMINI_MODEL });
  if (req.method !== 'POST' || !['/api/ai/analyze', '/api/ai/chat'].includes(req.url || '')) return send(404, { error: 'Không tìm thấy API.' });
  const origin = req.headers.origin;
  if (origin && !['http://localhost:5173', 'http://127.0.0.1:5173'].includes(origin)) return send(403, { error: 'Nguồn yêu cầu không được phép.' });
  if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Cần dữ liệu JSON.' });
  if (active >= 2) return send(429, { error: 'AI đang bận, vui lòng thử lại sau.' });
  active++;
  try {
    const chunks: Buffer[] = []; let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > 1500000) { send(413, { error: 'Dữ liệu quá lớn.' }); return; } chunks.push(Buffer.from(chunk)); }
    const raw = Buffer.concat(chunks).toString('utf8');
    let input;
    try { input = requestSchema.parse(JSON.parse(raw)); } catch { return send(400, { error: 'Dữ liệu không hợp lệ hoặc chưa có bản ghi. Hãy kiểm tra ngày và các ô số.' }); }
    const result = await runAi(input, req.url === '/api/ai/chat');
    send(200, result);
  } catch (error: any) {
    // Never return/log provider request objects: they may contain credentials or campaign data.
    if (error?.message === 'NOT_CONFIGURED') send(503, { error: 'Chưa cấu hình khóa Gemini ở máy chủ.' });
    else if (['INVALID_PERIOD', 'QUESTION_REQUIRED'].includes(error?.message)) send(400, { error: 'Kỳ hoặc câu hỏi không hợp lệ.' });
    else if (error?.statusCode === 429) send(429, { error: 'Gemini đã hết hạn mức hoặc đang quá tải. Hãy thử lại sau.' });
    else send(502, { error: 'Chưa nhận được phản hồi hợp lệ từ Gemini. Hãy thử lại; KPI và báo cáo cơ bản vẫn dùng được.' });
  } finally { active--; }
});
server.listen(Number(process.env.API_PORT || 3001), '127.0.0.1', () => console.log('AdPulse API: http://127.0.0.1:3001'));
