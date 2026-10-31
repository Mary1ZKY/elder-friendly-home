# 长者友好 · 居家改造

面向长者及其家人的适老化居家改造官网与原生微信小程序，包含服务介绍、泉山逸品案例、六类房间自查、入门改善参考预算、常见问题与电话咨询。

官网：https://mary1zky.github.io/elder-friendly-home/ 。咨询电话：19295319008。

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
- `case.css`、`media/`：泉山逸品案例展示及去除元数据的精选照片。
- `miniprogram/`：可以直接导入微信开发者工具的原生小程序项目，见其中的 README。

## 当前功能边界

居家自查使用访客勾选的情况和固定价格规则；没有接入 AI 图片识别。照片仅在浏览器中选择，不会上传。需求整理按钮将文字复制到剪贴板，供访客自行发送；直接咨询使用电话入口，不伪装后台提交成功。

小程序采用 `touristappid`，支持本机开发者工具预览；真机预览和正式发布需要所有者的小程序 AppID、微信登录与平台审核。小程序以原生页面整合官网内容，完整官网链接可复制，不依赖未经配置的 web-view 业务域名。

按用户决定，同角度现场效果图和正式前后对比视频待补充素材后制作；案例中的室内风格图为用户提供的参考，非该户型完工实拍。

参考价格不是现场报价，自查结果仅辅助家庭沟通。

## 来源

自查流程及部分参考价格取自 [AnjuGuard](https://github.com/banshanbans/AnjuGuard)。上游 MIT 许可与版权声明保存在 `THIRD_PARTY_NOTICES.md`。本网站并非该项目的官方站点。
