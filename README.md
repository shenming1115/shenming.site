# 🛡️ Shenming 安全网站

一个具有高级安全防护功能的网站，包含反调试、行为分析、设备指纹等多重安全机制。

## 📁 文件结构

```
shenming.site/
├── index.html              # 主页面
├── script.js               # JavaScript 安全逻辑
├── styles.css              # 样式文件
├── server.js               # 开发服务器
├── package.json            # 项目配置
├── README.md               # 说明文档
├── burp-1.mp3              # 音频文件
├── psycho-kev-9uYCEzNYZ2A-unsplash.jpg  # 图片文件
└── test.html               # 测试文件（备份）
```

## 🚀 快速开始

### 方法1：直接打开
双击 `index.html` 文件在浏览器中打开

### 方法2：使用本地服务器
```bash
# 启动内置服务器
node server.js

# 然后访问 http://localhost:3000
```

### 方法3：使用 http-server
```bash
# 安装依赖
npm install

# 使用 http-server
npx http-server -p 3000

# 访问 http://localhost:3000
```

## 🛡️ 安全功能

### 反调试保护
- F12 开发者工具检测
- 右键菜单禁用
- 控制台检测
- 窗口大小监控
- 时间差检测

### 行为分析
- 鼠标轨迹分析
- 点击模式检测
- 键盘节奏分析
- 滚动行为监控
- 蜜罐陷阱

### 设备指纹
- Canvas 指纹
- WebGL 指纹
- 音频指纹
- 字体检测
- 硬件信息

### 自动化检测
- Selenium 检测
- Puppeteer 检测
- Playwright 检测
- Headless 浏览器检测

### 人机验证
- Cloudflare Turnstile 集成
- 风险等级评估
- IP 地理位置分析
- 额外邮箱验证（高风险用户）

## ⚙️ 配置

### 开发模式
在 `script.js` 中找到：
```javascript
const DEVELOPMENT_MODE = true;  // 生产环境请设为 false
```

### Cloudflare Turnstile
在 `index.html` 中替换：
```html
data-sitekey="0x4AAAAAAAYourSiteKeyHere"  <!-- 替换为你的实际 sitekey -->
```

## 🔒 安全特性

### 历史记录保护
- 彻底阻止返回页面
- 重写浏览器历史API
- 监听各种导航事件
- 强制跳转到安全页面

### 混淆保护
- 变量名混淆
- 控制台输出干扰
- 多层调试陷阱
- 代码完整性检查

## ⚠️ 注意事项

1. 生产环境请关闭开发模式
2. 替换 Cloudflare Turnstile 的实际密钥
3. 配置后端日志收集服务
4. 根据需要调整安全阈值
5. 定期更新安全策略

---

**警告**: 此代码仅用于学习和合法的安全防护目的。请遵守相关法律法规，不得用于非法用途。