# 赋能模拟器 · 项目常驻说明

本文件每个会话自动加载。项目总纲在 `Zcode.md`（协作规则 / 决策记录 / 进度看板 / 节点存档），**动手前先读它**。

## 协作铁律（用户明确要求）
1. 说人话：用户零编程基础，术语必须解释。
2. **技术决定权在用户**：新技术选型必须列 2~4 个方案（优劣+推荐），用户拍板后才动工；已决定的记录在 Zcode.md。
3. 决策留痕：每个新决策追加进 Zcode.md 决策记录表（**追加新行，绝不覆盖旧行**）。
4. 新文件一律放 D 盘、命名通俗、排列整洁。
5. 关键节点 git 提交 + 打标签（M0~M4 已完成），登记 Zcode.md 第九节。
6. 包管理器用 pnpm（已锁定 pnpm@10.17.0，corepack 调用）；不用 npm。

## 项目速览
- 纯 HTML/CSS/JS 原型 + Electron 壳（`electron/main.js`）；数据在 `data/`；逻辑在 `js/app.js`。
- 准星渲染比例：**0.625px/代码单位**（用户反复校准过，勿动）。
- 本地预览：`http://localhost:8321`（服务器没开就后台跑 `python -m http.server 8321`）。
- 在线网站：https://cjuntong.github.io/funeng-moniqi/ （绑定 main 分支，push 后 1~2 分钟自动更新）。
- 远端：CJuntong/funeng-moniqi；仓库已固定可用推送线路，push 失败换 IP 见 `.zcode/skills/empower-github-archive/SKILL.md`。

## 自动化设施
- **每次 git commit 后**：PostToolUse 钩子（`.zcode/config.json`）自动验证全部 JS 语法，通过且有待推提交则自动 `git push`；失败会打印原因、不阻塞。
- 更新 app 的标准流程：调用技能 `empower-update`。
- 手动全量存档：调用技能 `empower-github-archive`。
- 并行子任务调度（采集/验证/存档）：调用技能 `empower-dev-agent`。
- 后台子代理并发 **≤ 2**；真实人物数据必须有来源，绝不编造。

## 已知环境坑
- GitHub 主站间歇性被墙：api.github.com 常可用；push 走本仓库固定的 `http.curloptResolve`，失效时备用 IP 见存档技能。
- Zcode.md 是追加式文档，编辑时小心不要覆盖已有行。
