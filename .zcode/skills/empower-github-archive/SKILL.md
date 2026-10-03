---
name: empower-github-archive
description: 把赋能模拟器的当前进度完整存档并上传 GitHub 时使用。用户说"存档/上传github/同步到云端/推送代码"时加载本技能。流程：检查改动→语法验证→提交→推送→远端核验→登记。
---

# 赋能模拟器 · GitHub 存档流程

项目：`D:\vibecoding\无畏契约辅助` · 远端：`CJuntong/funeng-moniqi`（公开仓库 + GitHub Pages 网站绑定 main 分支）

## 1. 检查改动
```
git status --short
git log origin/main..main --oneline
```
- 工作区干净且无未推送提交 → 告诉用户"已是最新"，结束。
- 确认 `node_modules/`、`release/`、`release-mac/` 没被意外加入（.gitignore 应挡住，见到就撤出）。

## 2. 语法验证
对所有 `js/*.js`、`data/*.js`、`electron/*.js` 跑 `node --check`，任何一个失败都**停止存档**，先修好。

## 3. 提交
```
git add -A
git commit -m "<通俗中文：改了什么、为什么>"
```
关键节点（里程碑完成）加 `git tag M<n>` 并在 Zcode.md 第九节登记。

## 4. 推送
```
git push
```
- 本仓库已固定线路（`http.curloptResolve`）；失败时依次试：
  1. `git -c http.curloptResolve="github.com:443:20.27.177.113" push`
  2. `git -c http.curloptResolve="github.com:443:20.200.245.247" push`
  3. `git -c http.curloptResolve="github.com:443:140.82.112.3" push`
- 全部失败 = 网络封锁期：告知用户"已本地存档，稍后再推"，**不要反复空转**（可留一个后台重试，90 秒间隔 ×20 次封顶）。

## 5. 远端核验
```
git ls-remote --tags origin
git log origin/main..main --oneline
```
- `origin/main..main` 为空 = 完全同步 ✓。
- 标签数量与本地一致 ✓。

## 6. 登记
- 在 `Zcode.md` 决策记录追加本次存档摘要（一行即可）。

## 7. 报告
- 成功：远端最新提交号、标签情况、网站将自动更新。
- 失败：失败在哪一步、本地提交号、恢复方法。

## 注意
- 每次提交都会触发自动验证推送钩子（`.zcode/config.json`），本技能是"手动全量存档"的增强版，两者不冲突。
- 推送可能带中文文件名（assets/选手照片 等），git 已配置正常处理，勿改 core.quotepath。
