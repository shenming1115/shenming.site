# 📁 文件结构整理

## 🎯 新的文件结构

```
shenming.site/
├── 📄 index.html                 # 主页面
├── 📄 favicon.svg                # SVG favicon
├── 📄 favicon.ico                # ICO favicon
├── 📄 sitemap.xml               # 搜索引擎站点地图
├── 📄 robots.txt                # 搜索引擎爬虫指令
├── 📄 site.webmanifest          # PWA配置
│
├── 📁 assets/                   # 静态资源
│   ├── 📁 icons/               # 图标文件
│   │   ├── logo.svg            # 主logo
│   │   ├── favicon-16x16.png   # 16x16 favicon
│   │   ├── favicon-32x32.png   # 32x32 favicon
│   │   └── apple-touch-icon.png # Apple设备图标
│   ├── 📁 images/              # 图片文件
│   │   └── preview.jpg         # 社交媒体预览图
│   └── 📁 media/               # 媒体文件
│       └── burp-1.mp3          # 音频文件
│
├── 📁 css/                     # 样式文件
│   ├── main.css                # 主样式文件
│   ├── base.css                # 基础样式
│   ├── components.css          # 组件样式
│   ├── pages.css               # 页面特定样式
│   └── themes.css              # 主题样式
│
├── 📁 js/                      # JavaScript文件
│   ├── main.js                 # 主脚本
│   ├── 📁 modules/             # 模块化脚本
│   │   ├── ui.js               # UI交互
│   │   ├── analytics.js        # 分析统计
│   │   ├── tetris.js           # 游戏逻辑
│   │   └── security.js         # 安全验证
│   └── 📁 utils/               # 工具函数
│       └── helpers.js          # 辅助函数
│
├── 📁 pages/                   # 其他页面
│   ├── tetris.html             # Tetris游戏页面
│   └── config-check.html       # 配置检查页面
│
├── 📁 docs/                    # 文档文件
│   ├── README.md               # 项目说明
│   ├── SEO_GUIDE.md            # SEO指南
│   ├── DESIGN_GUIDE.md         # 设计指南
│   └── FILE_STRUCTURE.md       # 文件结构说明
│
└── 📁 config/                  # 配置文件
    ├── analytics.config.js     # 分析配置
    └── build.config.js         # 构建配置
```

## 🔄 文件迁移计划

### 第一步：创建文件夹结构
- [x] assets/icons/
- [x] css/
- [x] js/modules/
- [x] js/utils/
- [x] pages/
- [x] docs/
- [x] config/

### 第二步：移动现有文件
- [ ] styles.css → css/base.css
- [ ] enhanced-styles.css → css/components.css
- [ ] final-polish.css → css/pages.css
- [ ] modern-dark-theme.css → css/themes.css
- [ ] script.js → js/modules/ui.js
- [ ] enhanced-ui.js → js/modules/ui.js (合并)
- [ ] tetris-game.js → js/modules/tetris.js
- [ ] analytics-setup.js → js/modules/analytics.js
- [ ] tetris-test.html → pages/tetris.html
- [ ] config-check.html → pages/config-check.html

### 第三步：更新引用路径
- [ ] 更新HTML中的CSS引用
- [ ] 更新HTML中的JS引用
- [ ] 更新相对路径引用

### 第四步：优化和清理
- [ ] 删除重复文件
- [ ] 合并相似功能
- [ ] 优化加载顺序

## 🎨 Logo和Favicon设置

### Logo文件
- ✅ assets/icons/logo.svg (主logo)
- ✅ favicon.svg (简化版favicon)

### 需要生成的Favicon
- [ ] favicon.ico (16x16, 32x32)
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png (180x180)
- [ ] android-chrome-192x192.png
- [ ] android-chrome-512x512.png

## 🚀 优化后的优势

1. **更清晰的结构** - 文件分类明确
2. **更好的维护性** - 模块化设计
3. **更快的加载速度** - 优化的资源组织
4. **更好的SEO** - 规范的文件结构
5. **更容易扩展** - 模块化架构

## 📋 检查清单

- [ ] 所有文件正确分类
- [ ] 所有路径引用正确
- [ ] 所有功能正常工作
- [ ] Logo和favicon正确显示
- [ ] SEO设置完整
- [ ] 性能优化完成