# 理财投资二屏卡工具 · 发布说明

这个项目是纯前端静态站点（`index.html + assets/`），可直接发布到静态托管平台。

## 发布前已完成

- 已移除页面中的默认 API Key，避免密钥泄露
- 已添加 `vercel.json`（Vercel 发布配置）
- 已添加 `netlify.toml`（Netlify 发布配置）

## 方案 A：Vercel（推荐）

1. 打开 [https://vercel.com](https://vercel.com) 并登录
2. 点击 `Add New...` -> `Project`
3. 导入当前项目目录：`理财投资二屏卡-批量素材`
4. Framework 选择 `Other`（静态站点）
5. Build Command 留空，Output Directory 留空或填写 `.`
6. 点击 `Deploy`
7. 发布后会得到可分享链接（如 `https://xxx.vercel.app`）

## 方案 B：Netlify

1. 打开 [https://app.netlify.com](https://app.netlify.com) 并登录
2. 点击 `Add new site` -> `Import an existing project`
3. 选择仓库或直接拖拽当前项目目录
4. Build command 留空，Publish directory 填 `.`
5. 点击 Deploy，获得可分享链接

## 方案 C：Cloudflare Pages（零构建）

1. 打开 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 进入 `Workers & Pages` -> `Create` -> `Pages`
3. 连接仓库并选择该项目
4. Build command 留空，Build output directory 填 `.`
5. 部署完成后获得链接

## 使用提醒（非常重要）

- 这个工具是前端直连各 AI 服务商 API，**每个使用者都应输入自己的 API Key**
- 不要在页面里预填你的私钥（尤其是 `AccessKey|SecretKey`）
- 如果要给团队统一体验，建议后续增加后端代理层，避免在浏览器暴露签名逻辑

## 本地预览（开发测试）

```bash
cd "/Users/zuoxiaolin3/Desktop/搜索专项/理财投资二屏卡-批量素材"
python3 -m http.server 8765
```

浏览器打开：

- `http://localhost:8765`
