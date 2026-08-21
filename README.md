# Linux DO · 企业微信文档外观

油猴脚本：把 [linux.do](https://linux.do/) 换成企业微信文档风。**只换皮，不碰数据**：帖子、链接、按钮、分类、标签和原交互都保留。

浅色跟企微网页；深色跟 GitHub Primer `dark_dimmed`（Soft dark）。

## 效果图

主页浅色：

<img src="docs/screenshots/home-light.jpg" alt="主页浅色" width="1880" />

主页深色：

<img src="docs/screenshots/home-dark.jpg" alt="主页深色" width="1880" />

话题页深色：

<img src="docs/screenshots/topic-dark.jpg" alt="话题页深色" width="1880" />

话题页浅色：

<img src="docs/screenshots/topic-light.jpg" alt="话题页浅色" width="1880" />

发帖深色：

<img src="docs/screenshots/compose-dark.jpg" alt="发帖深色" width="1880" />

发帖浅色：

<img src="docs/screenshots/compose-light.jpg" alt="发帖浅色" width="1880" />

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey）。
2. 打开 [`linuxdo-wecom.user.js`](./linuxdo-wecom.user.js)，点 **Raw** 后按提示安装。
3. 访问 <https://linux.do/>。

开发：

```bash
npm test
npm run build
```

改 `wecom-*.mjs` / `wecom-style.css` 后必须 `npm run build` 再装生成的 `linuxdo-wecom.user.js`。

## 友链

[linux.do](https://linux.do/)
