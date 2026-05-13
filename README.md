# 理财投资二屏卡 · 批量素材工作台

静态前端工具（`index.html + assets/`），支持素材库、Prompt 构建、AI 批量生成与本地历史。

## 固定链接自动部署（推荐）

目标：后续每次改代码都自动更新，同一个网址不变。

### 方案 A：GitHub + Netlify

1. 在 GitHub 新建仓库（例如：`finance-asset-workbench`）
2. 上传本目录代码（至少包含 `index.html`、`assets/`、`netlify.toml`）
3. 打开 Netlify -> `Add new site` -> `Import an existing project`
4. 选择这个 GitHub 仓库
5. 构建参数：
   - Build command: 留空
   - Publish directory: `.`
6. 点击 Deploy

完成后得到固定站点链接，之后只要更新 GitHub 代码，Netlify 自动发布新版本。

### 方案 B：GitHub + Vercel

1. 在 GitHub 新建仓库并上传本目录代码
2. 打开 Vercel -> `Add New...` -> `Project`
3. 选择该仓库导入
4. 框架选择 `Other`
5. Build command 留空，Output directory 为 `.`
6. Deploy

完成后同样可获得固定链接，后续推送代码自动更新。

## 安全提醒

- 请勿在代码中预置个人 API Key
- 用户应在页面中自行填入 API Key（浏览器本地保存，仅自己可见）
- 对外分享前可用无痕窗口打开站点，确认 `API Key` 输入框为空
