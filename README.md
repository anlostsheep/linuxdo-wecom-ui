# Linux DO · 企业微信文档外观

油猴脚本：把 [linux.do](https://linux.do/) 换成企业微信文档风。只换皮。

浅色跟企微网页；深色跟 GitHub Primer `dark_dimmed`（Soft dark）。

## 安装

1. 安装 Tampermonkey 或 Violentmonkey。
2. 打开 `linuxdo-wecom.user.js` 的 Raw 并安装。
3. 访问 https://linux.do/ 。

开发：

```bash
npm test
npm run build
```

改 `wecom-*.mjs` / `wecom-style.css` 后必须 `npm run build` 再装生成的 `linuxdo-wecom.user.js`。
