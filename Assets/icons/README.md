# 🎨 图标文件说明

## 📁 当前文件
- `logo.svg` - 主要logo文件（完整版）

## 📋 需要生成的Favicon文件

基于你的logo，需要生成以下尺寸的favicon：

### 必需文件
1. `favicon.ico` (16x16, 32x32, 48x48)
2. `favicon-16x16.png`
3. `favicon-32x32.png`
4. `apple-touch-icon.png` (180x180)
5. `android-chrome-192x192.png`
6. `android-chrome-512x512.png`

## 🛠️ 快速生成方法

### 使用在线工具（推荐）
1. 访问 [RealFaviconGenerator](https://realfavicongenerator.net/)
2. 上传你的 `logo.svg` 文件
3. 按照指引调整各平台的显示效果
4. 下载生成的文件包
5. 将所有文件放到这个文件夹中

### 手动创建简化版本
如果需要简化版本，可以创建一个只包含"SM"字母的版本：
- 背景色：#3498DB
- 文字色：#FFFFFF
- 字体：Inter, 粗体
- 圆角：4px

## 📱 预览效果

生成后的favicon将在以下地方显示：
- 浏览器标签页
- 书签栏
- 移动设备主屏幕（如果添加到主屏幕）
- 搜索结果（某些情况下）
- 社交媒体分享链接

## ✅ 完成检查

生成文件后，请确保：
- [ ] 所有尺寸的文件都已生成
- [ ] 文件名正确
- [ ] 在不同设备和浏览器中测试显示效果
- [ ] 更新 `site.webmanifest` 中的图标路径