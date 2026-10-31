# 长者友好 · 居家改造

面向长者及其家人的适老化居家改造静态官网，包含服务介绍、六类房间的居家自查、入门改善参考预算、常见问题与咨询表单演示。

## 运行

直接打开 `index.html`，或在项目目录运行 `python3 -m http.server 4189` 后访问 `http://127.0.0.1:4189/`。无需安装依赖或执行构建。

## 发布到 GitHub Pages

在仓库 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**，选择 **main** 和 **/(root)**，保存即可发布。之后更新 main 分支的网页文件，GitHub Pages 会重新发布。

所有页面资源都使用相对路径，支持 GitHub Pages 的仓库子路径。

## 文件

- `index.html`：网站入口。
- `style.css`、`industry.css`、`warm.css`、`natural.css`：现有网站样式。
- `assessment.css`：居家自查模块样式。
- `script.js`：房间检查、预算汇总与咨询表单交互。

## 当前功能边界

居家自查使用访客勾选的情况和固定价格规则；没有接入 AI 图片识别。照片仅在浏览器中选择，不会上传。咨询表单为本地演示，不会接收、发送或保存留言。正式接收咨询需要另行接入表单服务。

参考价格不是现场报价，自查结果仅辅助家庭沟通。

## 来源

自查流程及部分参考价格取自 [AnjuGuard](https://github.com/banshanbans/AnjuGuard)。上游 MIT 许可与版权声明保存在 `THIRD_PARTY_NOTICES.md`。本网站并非该项目的官方站点。
