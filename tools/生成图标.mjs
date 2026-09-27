// 把 assets/图标/源能战魂.png（256×256 RGBA）打包成 Windows .ico 图标
// ICO 支持内嵌 PNG 条目（Vista+ 标准），无需第三方库
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const png = readFileSync(join(root, "assets", "图标", "源能战魂.png"));

if (png.length > 1024 * 1024) throw new Error("PNG 超过 1MB，需先压缩");
if (!(png[0] === 0x89 && png[1] === 0x50)) throw new Error("不是 PNG 文件");

// 256×256 在 ICO 条目里宽高记为 0
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);      // 保留位
header.writeUInt16LE(1, 2);      // 类型：图标
header.writeUInt16LE(1, 4);      // 条目数
const entry = Buffer.alloc(16);
entry.writeUInt8(0, 0);          // 宽 256 → 0
entry.writeUInt8(0, 1);          // 高 256 → 0
entry.writeUInt8(0, 2);          // 调色板数
entry.writeUInt8(0, 3);          // 保留位
entry.writeUInt16LE(1, 4);       // 色彩平面
entry.writeUInt16LE(32, 6);      // 位深
entry.writeUInt32LE(png.length, 8);  // 数据大小
entry.writeUInt32LE(22, 12);     // 数据偏移（6 + 16）

const out = Buffer.concat([header, entry, png]);
const dest = join(root, "electron", "icons", "icon.ico");
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log("已生成:", dest, `(${out.length} 字节)`);
