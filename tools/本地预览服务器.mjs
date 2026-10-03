// 本地预览服务器（无缓存版）：所有响应带 Cache-Control: no-store，浏览器永不缓存旧图
// 用法：node tools/本地预览服务器.mjs  （端口 8321）
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)) + "/..";
const mime = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript",
  ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon",
  ".md": "text/plain; charset=utf-8",
};

createServer(async (req, res) => {
  try {
    const u = decodeURIComponent((req.url || "/").split("?")[0]);
    const p = normalize(join(root, u === "/" ? "index.html" : u));
    if (!p.startsWith(normalize(root))) { res.writeHead(403); res.end(); return; }
    const data = await readFile(p);
    res.writeHead(200, {
      "Content-Type": mime[extname(p).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404); res.end("404");
  }
}).listen(8321, () => console.log("预览服务器已启动: http://localhost:8321 （无缓存模式）"));
