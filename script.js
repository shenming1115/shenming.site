// Content section show/hide logic
document.addEventListener('DOMContentLoaded', function() {
  const contentNavs = document.querySelectorAll('#contentNav');
  const contentPage = document.getElementById('contentPage');
  const mainContent = document.getElementById('mainContent');
  // 进入content模式
  contentNavs.forEach(contentNav => {
    contentNav.addEventListener('click', function(e) {
      e.preventDefault();
      // 切换显示
      mainContent.style.display = 'none';
      contentPage.style.display = 'block';
      document.body.classList.add('content-mode');
      // 高亮当前按钮
      document.querySelectorAll('.navbar-links a').forEach(a => {
        a.classList.toggle('active', a.id === 'contentNav');
      });
    });
  });
  // 离开content模式
  document.querySelectorAll('.navbar-links a[href^="#"]').forEach(link => {
    if(link.id !== 'contentNav') {
      link.addEventListener('click', function() {
        contentPage.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.classList.remove('content-mode');
        document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
      });
    }
  });
});

// 获取马来西亚时间和IP，分别用于验证前和主界面
async function fetchMalaysiaTimeAndIP() {
  // 获取马来西亚时间（使用 timeapi.io，支持CORS）
  let malaysiaTime = '';
  let userIP = '';
  try {
    const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kuala_Lumpur');
    const data = await res.json();
    malaysiaTime = `${data.year}-${String(data.month).padStart(2,'0')}-${String(data.day).padStart(2,'0')} ${String(data.hour).padStart(2,'0')}:${String(data.minute).padStart(2,'0')}:${String(data.seconds).padStart(2,'0')} (MY)`;
    document.getElementById('preVerifyDatetime').textContent = malaysiaTime;
    window._malaysiaTime = malaysiaTime;
  } catch (e) {
    document.getElementById('preVerifyDatetime').textContent = '无法获取马来西亚时间';
    window._malaysiaTime = '';
    console.error('马来西亚时间获取失败', e);
  }
  // 获取IP
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    userIP = ipData.ip;
    document.getElementById('ipInfo').innerHTML = 'IP: ' + userIP;
    window._userIP = userIP;
  } catch (e) {
    document.getElementById('ipInfo').innerHTML = 'IP: 获取失败';
    window._userIP = '';
    console.error('IP获取失败', e);
  }
  // content页面也显示时间和IP
  if (document.getElementById('contentDatetime')) {
    document.getElementById('contentDatetime').textContent = malaysiaTime ? ('Malaysia Time: ' + malaysiaTime) : '无法获取马来西亚时间';
  }
  if (document.getElementById('contentIP')) {
    document.getElementById('contentIP').textContent = userIP ? ('Your IP: ' + userIP) : 'IP: 获取失败';
  }
}
fetchMalaysiaTimeAndIP();

// 验证成功后切换到主内容和紫色渐变背景，并显示时间/IP
// 处理验证成功的回调函数
function handleTurnstileSuccess(token) {
  // 隐藏验证遮罩
  document.getElementById('preVerifyMask').style.display = 'none';
  
  // 显示主内容并添加背景
  const mainContent = document.getElementById('mainContent');
  mainContent.style.display = 'block';
  document.body.classList.add('after-verify-bg');
  
  // 更新时间显示
  if (window._malaysiaTime) {
    document.getElementById('mainWelcome').textContent = window._malaysiaTime;
    document.getElementById('mainDatetime').textContent = 'Malaysia Time: ' + window._malaysiaTime;
  } else {
    document.getElementById('mainWelcome').textContent = '无法获取马来西亚时间';
  }
  
  // 更新IP显示
  if (window._userIP) {
    document.getElementById('mainIP').textContent = 'Your IP: ' + window._userIP;
  } else {
    document.getElementById('mainIP').textContent = 'IP: 获取失败';
  }
  document.getElementById('mainIP').style.display = 'block';
  
  // 自动滚动到主页
  setTimeout(() => {
    document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// 设置 Turnstile 回调
window.onTurnstileSuccess = handleTurnstileSuccess;

// 更顺滑的水流渐变动画
const preVerifyColors = [
  [30,60,114], [42,82,152], [106,17,203], [37,117,252], [67,206,162], [24,90,157], [247,151,30], [255,210,0], [253,29,29], [131,58,180], [252,176,69]
];
let t = 0;
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function rgbArrToStr(arr) {
  return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
}
function animatePreVerifyBg() {
  const mask = document.getElementById('preVerifyMask');
  if (!mask) return;
  // 计算当前渐变的两个颜色
  const idx1 = Math.floor(t) % preVerifyColors.length;
  const idx2 = (idx1 + 1) % preVerifyColors.length;
  const frac = t - Math.floor(t);
  const color1 = [
    lerp(preVerifyColors[idx1][0], preVerifyColors[idx2][0], frac),
    lerp(preVerifyColors[idx1][1], preVerifyColors[idx2][1], frac),
    lerp(preVerifyColors[idx1][2], preVerifyColors[idx2][2], frac)
  ];
  const idx3 = (idx1 + 2) % preVerifyColors.length;
  const color2 = [
    lerp(preVerifyColors[idx2][0], preVerifyColors[idx3][0], frac),
    lerp(preVerifyColors[idx2][1], preVerifyColors[idx3][1], frac),
    lerp(preVerifyColors[idx2][2], preVerifyColors[idx3][2], frac)
  ];
  mask.style.background = `linear-gradient(135deg, ${rgbArrToStr(color1)}, ${rgbArrToStr(color2)})`;
  t += 0.015; // 控制流动速度
  requestAnimationFrame(animatePreVerifyBg);
}
animatePreVerifyBg();
// 🚫 增强的DevTools检测和防护
let devToolsDetected = false;

function antiDevTools() {
  if (devToolsDetected) return;
  devToolsDetected = true;
  // 清除缓存和历史记录，不再跳转google
  try {
    // 清除本地存储和session
    localStorage.clear();
    sessionStorage.clear();
    // 清空所有cookie
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
    // 清空历史记录
    for (let i = 0; i < 20; i++) {
      window.history.pushState(null, null, window.location.href + '#block' + Math.random());
    }
    // 阻止返回（不再跳转）
    window.onpopstate = function() {
      // no-op
    };
    window.history.pushState = function() {
      // no-op
    };
    window.history.back = function() {
      // no-op
    };
    window.history.go = function() {
      // no-op
    };
    // beforeunload 不再跳转
    window.addEventListener('beforeunload', function(e) {
      // no-op
    });
    // 可见性变化不再跳转
    document.addEventListener('visibilitychange', function() {
      // no-op
    });
  } catch(e) {}
  // 不再立即跳转
}

// 全局安全状态
let securityState = {
  ipInfo: null,
  riskLevel: 'unknown',
  turnstileVerified: false,
  deviceFingerprint: null,
  behaviorAnalysis: {
    mouseTrajectory: [],
    clickPattern: [],
    keyboardRhythm: [],
    scrollBehavior: [],
    suspiciousActivity: 0
  },
  advancedFingerprint: null
};

// 🎯 高级反调试和混淆保护
const antiDebugProtection = (() => {
  const _0x1a2b = ['devtools', 'console', 'debug', 'firebug'];
  let _0x3c4d = 0;
  
  // 控制台输出干扰
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };
  
  // 劫持控制台
  console.log = console.warn = console.error = console.info = function() {
    _0x3c4d++;
    if (_0x3c4d > 10) { // 提高阈值，避免误判
      antiDevTools();
    }
    return false;
  };
  
  // 时间检测陷阱
  const timeCheck = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) { // 提高阈值
      antiDevTools();
    }
  };
  
  // 多重调试器陷阱
  const debugTraps = [
    () => { debugger; },
    () => { eval('debugger'); },
    () => { (function(){debugger;})(); },
    () => { Function('debugger')(); }
  ];
  
  // 随机执行调试陷阱
  setInterval(() => {
    const trap = debugTraps[Math.floor(Math.random() * debugTraps.length)];
    try {
      const before = Date.now();
      trap();
      const after = Date.now();
      if (after - before > 200) { // 提高阈值
        antiDevTools();
      }
    } catch(e) {
      // 移除自动触发antiDevTools，避免误判
    }
  }, 10000 + Math.random() * 10000); // 降低检测频率
  
  // 检测开发者工具特征
  const detectDevTools = () => {
    let devtools = {open: false};
    const element = document.createElement('div');
    Object.defineProperty(element, 'id', {
      get: function() {
        devtools.open = true;
        antiDevTools();
      }
    });
    setInterval(() => {
      console.dir(element);
    }, 2000);
  };
  
  return {
    timeCheck,
    detectDevTools,
    init: function() {
      detectDevTools();
      // 降低检测频率，避免影响正常使用
      setInterval(timeCheck, 5000);
    }
  };
})();

// 🕵️ 鼠标轨迹和行为分析系统
const behaviorAnalyzer = {
  mousePoints: [],
  clickTimes: [],
  keyPressTimes: [],
  scrollEvents: [],
  
  // 记录鼠标轨迹
  trackMouseMovement: function(e) {
    const now = Date.now();
    this.mousePoints.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: now
    });
    
    // 保持最近1000个点
    if (this.mousePoints.length > 1000) {
      this.mousePoints.shift();
    }
    
    // 分析鼠标轨迹异常
    if (this.mousePoints.length > 10) {
      this.analyzeMouseBehavior();
    }
  },
  
  // 分析鼠标行为
  analyzeMouseBehavior: function() {
    const recent = this.mousePoints.slice(-10);
    let straightLines = 0;
    let perfectCurves = 0;
    let unnaturalSpeed = 0;
    
    // 检测直线移动（机器人特征）
    for (let i = 2; i < recent.length; i++) {
      const p1 = recent[i-2], p2 = recent[i-1], p3 = recent[i];
      const slope1 = (p2.y - p1.y) / (p2.x - p1.x);
      const slope2 = (p3.y - p2.y) / (p3.x - p2.x);
      
      if (Math.abs(slope1 - slope2) < 0.01 && !isNaN(slope1) && !isNaN(slope2)) {
        straightLines++;
      }
      
      // 检测不自然的速度
      const distance = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
      const time = p3.timestamp - p2.timestamp;
      const speed = distance / time;
      
      if (speed > 5 || speed < 0.1) {
        unnaturalSpeed++;
      }
    }
    
    // 更新可疑活动分数
    if (straightLines > 8 || unnaturalSpeed > 8) { // 提高阈值
      securityState.behaviorAnalysis.suspiciousActivity += 1; // 降低分数增加
      this.logSuspiciousActivity('unnatural_mouse_movement', {
        straightLines,
        unnaturalSpeed
      });
    }
  },
  
  // 记录点击模式
  trackClick: function(e) {
    const now = Date.now();
    this.clickTimes.push(now);
    
    // 检测点击间隔（机器人通常有固定间隔）
    if (this.clickTimes.length > 5) {
      const intervals = [];
      for (let i = 1; i < this.clickTimes.length; i++) {
        intervals.push(this.clickTimes[i] - this.clickTimes[i-1]);
      }
      
      // 检测间隔是否过于规律
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avgInterval, 2), 0) / intervals.length;
      
      if (variance < 50 && avgInterval < 1000) { // 调整阈值，避免误判正常点击
        securityState.behaviorAnalysis.suspiciousActivity += 2;
        this.logSuspiciousActivity('robotic_clicking', {
          variance,
          avgInterval
        });
      }
      
      // 保持最近20次点击
      if (this.clickTimes.length > 20) {
        this.clickTimes.shift();
      }
    }
  },
  
  // 记录键盘节奏
  trackKeypress: function(e) {
    const now = Date.now();
    this.keyPressTimes.push({
      key: e.key,
      timestamp: now
    });
    
    // 分析打字节奏
    if (this.keyPressTimes.length > 10) {
      const recent = this.keyPressTimes.slice(-10);
      const intervals = [];
      
      for (let i = 1; i < recent.length; i++) {
        intervals.push(recent[i].timestamp - recent[i-1].timestamp);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avgInterval, 2), 0) / intervals.length;
      
      // 检测机器人打字特征
      if (variance < 50 || avgInterval < 50) {
        securityState.behaviorAnalysis.suspiciousActivity += 2;
        this.logSuspiciousActivity('robotic_typing', {
          variance,
          avgInterval
        });
      }
      
      // 保持最近50次按键
      if (this.keyPressTimes.length > 50) {
        this.keyPressTimes.shift();
      }
    }
  },
  
  // 记录滚动行为
  trackScroll: function(e) {
    const now = Date.now();
    this.scrollEvents.push({
      scrollY: window.scrollY,
      timestamp: now
    });
    
    // 检测滚动行为异常
    if (this.scrollEvents.length > 5) {
      const recent = this.scrollEvents.slice(-5);
      let uniformScrolling = 0;
      
      for (let i = 1; i < recent.length; i++) {
        const scrollDiff = Math.abs(recent[i].scrollY - recent[i-1].scrollY);
        if (scrollDiff > 0 && scrollDiff % 100 === 0) { // 完美的100px滚动
          uniformScrolling++;
        }
      }
      
      if (uniformScrolling > 3) {
        securityState.behaviorAnalysis.suspiciousActivity += 1;
        this.logSuspiciousActivity('robotic_scrolling', {
          uniformScrolling
        });
      }
      
      // 保持最近20次滚动
      if (this.scrollEvents.length > 20) {
        this.scrollEvents.shift();
      }
    }
  },
  
  // 检测蜜罐陷阱
  setupHoneyPot: function() {
    // 创建隐藏的蜜罐元素
    const honeypot = document.createElement('div');
    honeypot.style.cssText = `
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    `;
    honeypot.innerHTML = '<input type="text" name="bot_trap" tabindex="-1">';
    document.body.appendChild(honeypot);
    
    // 如果有交互说明是机器人
    honeypot.addEventListener('click', () => {
      securityState.behaviorAnalysis.suspiciousActivity += 10;
      this.logSuspiciousActivity('honeypot_interaction', {});
      antiDevTools();
    });
    
    const input = honeypot.querySelector('input');
    input.addEventListener('input', () => {
      securityState.behaviorAnalysis.suspiciousActivity += 10;
      this.logSuspiciousActivity('honeypot_input', {});
      antiDevTools();
    });
  },
  
  // 记录可疑活动
  logSuspiciousActivity: function(type, data) {
    console.log(`Suspicious activity detected: ${type}`, data);
    logSecurityEvent('suspicious_behavior', {
      type,
      data,
      totalSuspiciousScore: securityState.behaviorAnalysis.suspiciousActivity,
      timestamp: new Date().toISOString()
    });
    
    // 如果可疑分数过高，提高风险等级
    if (securityState.behaviorAnalysis.suspiciousActivity > 20) { // 提高阈值
      securityState.riskLevel = 'high';
      updateRiskDisplay(['机器人行为']);
    }
  },
  
  // 初始化行为监控
  init: function() {
    document.addEventListener('mousemove', this.trackMouseMovement.bind(this));
    document.addEventListener('click', this.trackClick.bind(this));
    document.addEventListener('keypress', this.trackKeypress.bind(this));
    document.addEventListener('scroll', this.trackScroll.bind(this));
    this.setupHoneyPot();
    
    // 定期分析行为模式
    setInterval(() => {
      this.analyzeBehaviorPattern();
    }, 30000);
  },
  
  // 综合行为模式分析
  analyzeBehaviorPattern: function() {
    const analysis = {
      mouseActivity: this.mousePoints.length,
      clickActivity: this.clickTimes.length,
      keyboardActivity: this.keyPressTimes.length,
      scrollActivity: this.scrollEvents.length,
      suspiciousScore: securityState.behaviorAnalysis.suspiciousActivity
    };
    
    // 检测完全没有人类行为的情况
    if (analysis.mouseActivity === 0 && analysis.clickActivity === 0) {
      securityState.behaviorAnalysis.suspiciousActivity += 5;
      this.logSuspiciousActivity('no_human_interaction', analysis);
    }
    
    // 记录行为分析结果
    logSecurityEvent('behavior_analysis', analysis);
  }
};
async function getUserIPInfo() {
  try {
    // 使用多个IP服务进行交叉验证
    const ipServices = [
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://api.ipify.org?format=json'
    ];
    
    let ipData = null;
    for (let service of ipServices) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          ipData = await response.json();
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (ipData) {
      securityState.ipInfo = ipData;
      displayIPInfo(ipData);
      calculateRiskLevel(ipData);
    }
  } catch (error) {
    console.log('IP detection blocked or failed');
    securityState.riskLevel = 'high';
    updateRiskDisplay();
  }
}

// 显示IP信息
function displayIPInfo(ipData) {
  const ipInfoDiv = document.getElementById('ipInfo');
  if (ipData.ip) {
    ipInfoDiv.innerHTML = `
      📍 IP: ${ipData.ip}<br>
      🌍 位置: ${ipData.city || 'Unknown'}, ${ipData.country || 'Unknown'}<br>
      🏢 ISP: ${ipData.org || ipData.isp || 'Unknown'}
    `;
  }
}

// 计算风险等级
function calculateRiskLevel(ipData) {
  let riskScore = 0;
  let riskFactors = [];

  // VPN/代理检测
  if (ipData.proxy || ipData.vpn) {
    riskScore += 3;
    riskFactors.push('VPN/代理');
  }

  // TOR检测  
  if (ipData.tor) {
    riskScore += 4;
    riskFactors.push('TOR网络');
  }

  // 高风险国家检测
  const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
  if (highRiskCountries.includes(ipData.country_code)) {
    riskScore += 2;
    riskFactors.push('高风险地区');
  }

  // 数据中心IP检测
  if (ipData.hosting || (ipData.org && ipData.org.toLowerCase().includes('hosting'))) {
    riskScore += 2;
    riskFactors.push('数据中心IP');
  }

  // 设备指纹检测
  const fingerprint = generateDeviceFingerprint();
  if (localStorage.getItem('deviceFingerprint')) {
    if (localStorage.getItem('deviceFingerprint') !== fingerprint) {
      riskScore += 2;
      riskFactors.push('设备异常');
    }
  } else {
    localStorage.setItem('deviceFingerprint', fingerprint);
  }

  // 确定风险等级
  if (riskScore >= 5) {
    securityState.riskLevel = 'high';
  } else if (riskScore >= 3) {
    securityState.riskLevel = 'medium';
  } else {
    securityState.riskLevel = 'low';
  }

  updateRiskDisplay(riskFactors);
  updateTurnstileConfiguration();
}

// 🔍 增强的设备指纹生成
function generateAdvancedDeviceFingerprint() {
  const fingerprint = {};
  
  try {
    // 基础信息
    fingerprint.screen = {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight
    };
    
    // Canvas指纹
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('🌈 Device Fingerprint 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Advanced Security System', 4, 35);
    
    fingerprint.canvas = canvas.toDataURL();
    
    // WebGL指纹
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        fingerprint.webgl = {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          version: gl.getParameter(gl.VERSION),
          shaderVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
        };
      }
    } catch (e) {
      fingerprint.webgl = 'blocked';
    }
    
    // 音频指纹
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const analyser = audioCtx.createAnalyser();
      const gain = audioCtx.createGain();
      const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
      
      gain.gain.value = 0;
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
      
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gain);
      gain.connect(audioCtx.destination);
      
      oscillator.start(0);
      
      const audioData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(audioData);
      fingerprint.audio = Array.from(audioData).join(',');
      
      oscillator.stop();
      audioCtx.close();
    } catch (e) {
      fingerprint.audio = 'blocked';
    }
    
    // 字体检测
    const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
    fingerprint.fonts = [];
    
    fonts.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = font;
      span.style.fontSize = '72px';
      span.innerHTML = 'mmmmmmmmmmlli';
      span.style.position = 'absolute';
      span.style.left = '-9999px';
      document.body.appendChild(span);
      
      const width = span.offsetWidth;
      const height = span.offsetHeight;
      document.body.removeChild(span);
      
      fingerprint.fonts.push({
        font: font,
        dimensions: `${width}x${height}`
      });
    });
    
    // 硬件信息
    fingerprint.hardware = {
      cores: navigator.hardwareConcurrency || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      languages: navigator.languages || [navigator.language]
    };
    
    // 时区和地理信息
    fingerprint.locale = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      language: navigator.language,
      languages: navigator.languages
    };
    
    // 传感器检测（移动设备）
    if ('DeviceMotionEvent' in window) {
      fingerprint.sensors = {
        deviceMotion: true,
        deviceOrientation: 'DeviceOrientationEvent' in window
      };
    }
    
    // 电池信息（如果可用）
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        fingerprint.battery = {
          charging: battery.charging,
          level: Math.round(battery.level * 100),
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      });
    }
    
    // 网络信息
    if ('connection' in navigator) {
      const conn = navigator.connection;
      fingerprint.network = {
        effectiveType: conn.effectiveType,
        type: conn.type,
        saveData: conn.saveData,
        rtt: conn.rtt,
        downlink: conn.downlink
      };
    }
    
  } catch (error) {
    fingerprint.error = error.message;
  }
  
  securityState.advancedFingerprint = fingerprint;
  return btoa(JSON.stringify(fingerprint));
}

// 保持原有的简单指纹函数用于兼容
function generateDeviceFingerprint() {
  return generateAdvancedDeviceFingerprint();
}

// 🔧 自动化工具检测
const automationDetector = {
  detected: false,
  
  // 检测Selenium
  detectSelenium: function() {
    return !!(
      window.webdriver ||
      window.navigator.webdriver ||
      window.callPhantom ||
      window._phantom ||
      window.phantom ||
      document.documentElement.getAttribute('webdriver') ||
      navigator.userAgent.indexOf('PhantomJS') !== -1 ||
      window.outerWidth === 0 ||
      window.outerHeight === 0
    );
  },
  
  // 检测Puppeteer
  detectPuppeteer: function() {
    return !!(
      window.navigator.webdriver ||
      (window.navigator.plugins.length === 0 && window.navigator.languages.length === 0)
    );
  },
  
  // 检测Playwright
  detectPlaywright: function() {
    return !!(
      window.playwright ||
      navigator.userAgent.includes('Playwright') ||
      window.navigator.webdriver
    );
  },
  
  // 检测Chrome headless
  detectHeadless: function() {
    return !!(
      (window.navigator.plugins.length === 0 && window.navigator.languages.length === 0) ||
      (window.outerWidth === 0 && window.outerHeight === 0)
    );
  },
  
  // 综合检测
  detect: function() {
    const selenium = this.detectSelenium();
    const puppeteer = this.detectPuppeteer();
    const playwright = this.detectPlaywright();
    const headless = this.detectHeadless();
    
    if (selenium || puppeteer || playwright || headless) {
      this.detected = true;
      securityState.behaviorAnalysis.suspiciousActivity += 10;
      
      logSecurityEvent('automation_detected', {
        selenium,
        puppeteer,
        playwright,
        headless,
        userAgent: navigator.userAgent,
        plugins: navigator.plugins.length,
        languages: navigator.languages.length
      });
      
      // 自动化工具检测到后延迟跳转，给用户更多时间
      setTimeout(() => {
        antiDevTools();
      }, 5000); // 延长到5秒
      
      return true;
    }
    return false;
  }
};
function updateRiskDisplay(riskFactors = []) {
  const riskDiv = document.getElementById('riskLevel');
  const colors = {
    low: '#4CAF50',
    medium: '#FF9800', 
    high: '#F44336',
    unknown: '#9E9E9E'
  };
  
  const icons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
    unknown: '⚪'
  };

  riskDiv.style.color = colors[securityState.riskLevel];
  riskDiv.innerHTML = `
    ${icons[securityState.riskLevel]} 风险等级: ${securityState.riskLevel.toUpperCase()}
    ${riskFactors.length > 0 ? '<br>⚠️ ' + riskFactors.join(', ') : ''}
  `;
}

// 根据风险等级配置Turnstile
function updateTurnstileConfiguration() {
  const turnstileDiv = document.querySelector('.cf-turnstile');
  
  // 根据风险等级调整验证难度
  switch (securityState.riskLevel) {
    case 'high':
      turnstileDiv.setAttribute('data-theme', 'light');
      turnstileDiv.setAttribute('data-size', 'normal');
      // 高风险用户需要额外验证
      addAdditionalVerification();
      break;
    case 'medium':
      turnstileDiv.setAttribute('data-theme', 'dark');
      turnstileDiv.setAttribute('data-size', 'normal');
      break;
    case 'low':
      turnstileDiv.setAttribute('data-theme', 'auto');
      turnstileDiv.setAttribute('data-size', 'compact');
      break;
  }
}

// 高风险用户额外验证
function addAdditionalVerification() {
  const form = document.getElementById('captchaForm');
  const additionalDiv = document.createElement('div');
  additionalDiv.innerHTML = `
    <div style="margin: 15px 0; padding: 10px; background: rgba(244,67,54,0.1); border-radius: 5px;">
      <p style="color: #F44336; font-size: 14px;">🚨 检测到高风险访问，需要额外验证</p>
      <input type="email" id="verifyEmail" placeholder="请输入邮箱地址" required 
             style="width: 200px; padding: 8px; margin: 5px; border-radius: 4px; border: 1px solid #ccc;">
      <button type="button" onclick="sendVerificationEmail()" 
              style="padding: 8px 15px; margin: 5px; background: #F44336; color: white; border: none; border-radius: 4px;">
        发送验证码
      </button>
    </div>
  `;
  form.insertBefore(additionalDiv, document.getElementById('verifyBtn'));
}

// Turnstile回调函数
// window.onTurnstileSuccess = function(token) {
//   console.log('✅ Turnstile验证成功');
//   securityState.turnstileVerified = true;
//   document.getElementById('verifyBtn').disabled = false;
//   document.getElementById('verifyBtn').style.opacity = '1';
//   document.getElementById('verificationResult').innerHTML = 
//     '<span style="color: #4CAF50;">✅ 人机验证成功</span>';
//
//   // 记录成功验证
//   // token 仅用于前端与后端通信，不再做任何页面跳转或敏感操作
//   logTurnstileEvent('turnstile_success', {
//     token: token,
//     riskLevel: securityState.riskLevel,
//   });
//
//   // 阻止form自动提交，防止页面跳转
//   var form = document.getElementById('captchaForm');
//   if (form) {
//     form.onsubmit = function(e) {
//       e.preventDefault();
//       document.getElementById('verificationResult').innerHTML = '<span style="color: #4CAF50;">✅ 验证已通过，无需跳转</span>';
//       return false;
//     };
//   }
//};

window.onTurnstileExpired = function() {
  console.log('⚠️ Turnstile验证已过期');
  securityState.turnstileVerified = false;
  document.getElementById('verifyBtn').disabled = true;
  document.getElementById('verifyBtn').style.opacity = '0.5';
  document.getElementById('verificationResult').innerHTML = 
    '<span style="color: #FF9800;">⚠️ 验证已过期，请重新验证</span>';
};

window.onTurnstileError = function(error) {
  console.error('❌ Turnstile验证错误:', error);

  let errorMessage = '';
  switch(error) {
    case 'network-error':
      errorMessage = '❌ 网络连接错误，请检查网络后重试';
      break;
    case 'timeout':
      errorMessage = '❌ 验证超时，请刷新页面重试';
      break;
    case 'invalid-sitekey':
      errorMessage = '❌ 站点配置错误，请联系管理员';
      break;
    case 'invalid-domain':
      errorMessage = '❌ 域名不匹配，请检查站点配置';
      break;
    case 'rate-limit':
      errorMessage = '❌ 请求过于频繁，请稍后再试';
      break;
    default:
      errorMessage = '❌ 验证失败: ' + error;
  }

  document.getElementById('verificationResult').innerHTML = 
    '<span style="color: #F44336;">' + errorMessage + '</span>';

  // 记录错误验证
  logTurnstileEvent('turnstile_error', {
    error: error,
    riskLevel: securityState.riskLevel,
  });
};

// 发送验证邮件 (高风险用户)
window.sendVerificationEmail = function() {
  const email = document.getElementById('verifyEmail').value;
  if (!email) {
    alert('请输入有效的邮箱地址');
    return;
  }
  
  // 这里应该调用后端API发送验证邮件
  alert('验证码已发送到 ' + email);
  logSecurityEvent('email_verification_sent', {
    email: email,
    riskLevel: securityState.riskLevel,
    timestamp: new Date().toISOString()
  });
};

// 🔄 重新加载Turnstile验证
window.refreshTurnstile = function() {
  console.log('🔄 重新加载Turnstile验证');
  
  try {
    // 重置验证状态
    securityState.turnstileVerified = false;
    document.getElementById('verifyBtn').disabled = true;
    document.getElementById('verifyBtn').style.opacity = '0.5';
    document.getElementById('verificationResult').innerHTML = 
      '<span style="color: #6c757d;">🔄 正在重新加载验证...</span>';
    
    // 如果Turnstile已加载，尝试重置
    if (window.turnstile) {
      const turnstileDiv = document.querySelector('.cf-turnstile');
      if (turnstileDiv) {
        // 清除现有的widget
        turnstileDiv.innerHTML = '';
        
        // 重新渲染
        setTimeout(() => {
          window.turnstile.render(turnstileDiv, {
            sitekey: '0x4AAAAAABjTIyITvZEz6LO_',
            theme: 'dark',
            size: 'normal',
            callback: 'onTurnstileSuccess',
            'expired-callback': 'onTurnstileExpired',
            'error-callback': 'onTurnstileError'
          });
          
          document.getElementById('verificationResult').innerHTML = 
            '<span style="color: #4CAF50;">✅ 验证已重新加载</span>';
        }, 500);
      }
    } else {
      // 如果Turnstile未加载，尝试重新加载脚本
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = function() {
        console.log('✅ Turnstile脚本重新加载成功');
        document.getElementById('verificationResult').innerHTML = 
          '<span style="color: #4CAF50;">✅ 验证服务已重新加载</span>';
      };
      script.onerror = function() {
        console.error('❌ Turnstile脚本重新加载失败');
        document.getElementById('verificationResult').innerHTML = 
          '<span style="color: #F44336;">❌ 验证服务重新加载失败</span>';
      };
      document.head.appendChild(script);
    }
    
    logSecurityEvent('turnstile_refresh', {
      timestamp: new Date().toISOString(),
      reason: 'manual_refresh'
    });
    
  } catch (error) {
    console.error('❌ 重新加载验证时出错:', error);
    document.getElementById('verificationResult').innerHTML = 
      '<span style="color: #F44336;">❌ 重新加载失败，请刷新页面</span>';
  }
};

// 自动重试机制
let retryCount = 0;
const maxRetries = 3;

function autoRetryTurnstile() {
  if (retryCount < maxRetries) {
    retryCount++;
    console.log(`🔄 自动重试Turnstile (${retryCount}/${maxRetries})`);
    
    setTimeout(() => {
      refreshTurnstile();
    }, 2000 * retryCount); // 递增延迟
  } else {
    console.log('❌ 达到最大重试次数');
    document.getElementById('verificationResult').innerHTML = 
      '<span style="color: #F44336;">❌ 验证服务连接失败，请检查网络后刷新页面</span>';
  }
}

// 域名检查（确保在正确的域名下使用）
function validateDomain() {
  const currentDomain = window.location.hostname;
  const allowedDomains = ['localhost', '127.0.0.1', 'shenming.site']; // 添加你的域名
  
  console.log('当前域名:', currentDomain);
  
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1' || currentDomain.includes('github.io')) {
    console.log('✅ 在本地或GitHub Pages环境中运行');
    return true;
  }
  
  // 检查是否在允许的域名中
  const isAllowed = allowedDomains.some(domain => 
    currentDomain === domain || currentDomain.endsWith('.' + domain)
  );
  
  if (!isAllowed) {
    console.warn('⚠️ 当前域名可能不在Turnstile配置的域名列表中');
  }
  
  return isAllowed;
}

// 页面加载时进行检查
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 开始Turnstile配置检查...');
  
  // 检查域名
  validateDomain();
  
  // 检查sitekey
  const turnstileDiv = document.querySelector('.cf-turnstile');
  if (turnstileDiv) {
    const sitekey = turnstileDiv.getAttribute('data-sitekey');
    console.log('Sitekey:', sitekey);
    
    if (sitekey === '0x4AAAAAAAYourSiteKeyHere') {
      console.error('❌ 仍在使用占位符sitekey');
    } else if (sitekey && sitekey.length > 10) {
      console.log('✅ Sitekey已配置');
    }
  }
});

// 基本页面功能
document.addEventListener('DOMContentLoaded', function() {
  // 音频播放功能
  const playButton = document.getElementById('playButton');
  if (playButton) {
    playButton.onclick = function () {
      const audioPlayer = document.getElementById('audioPlayer');
      if (audioPlayer) {
        audioPlayer.play();
      }
    };
  }

  // 眼睛跟踪功能
  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll('.eye').forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      if (pupil) {
        const rect = eye.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const radius = 10;
        pupil.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`;
      }
    });
  });

  // 眨眼效果
  setInterval(() => {
    document.querySelectorAll('.eye').forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      if (pupil) {
        eye.classList.add('blinking');
        pupil.classList.add('blinking');
        setTimeout(() => {
          eye.classList.remove('blinking');
          pupil.classList.remove('blinking');
        }, 250);
      }
    });
  }, 4000);

  // 夜间模式切换
  const modeBtn = document.getElementById('toggleMode');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      modeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
  }
});

// 安全仪表板控制函数
window.toggleSecurityDashboard = function() {
  const dashboard = document.getElementById('securityDashboard');
  if (dashboard) {
    dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
  }
};

// 🔍 Turnstile 加载和状态检查
function checkTurnstileStatus() {
  if (typeof window.turnstile === 'undefined') {
    console.log('⏳ Turnstile脚本尚未加载');
    return false;
  }
  
  console.log('✅ Turnstile脚本已加载');
  return true;
}

// 监听Turnstile脚本加载
window.addEventListener('load', function() {
  setTimeout(function() {
    if (!checkTurnstileStatus()) {
      document.getElementById('verificationResult').innerHTML = 
        '<span style="color: #FF9800;">⚠️ 验证服务加载中，请稍候...</span>';
        
      // 再次检查
      setTimeout(function() {
        if (!checkTurnstileStatus()) {
          document.getElementById('verificationResult').innerHTML = 
            '<span style="color: #F44336;">❌ 验证服务加载失败，请检查网络连接</span>';
        } else {
          document.getElementById('verificationResult').innerHTML = 
            '<span style="color: #4CAF50;">✅ 验证服务已就绪</span>';
        }
      }, 5000);
    }
  }, 2000);
});

// 域名检查（确保在正确的域名下使用）
function validateDomain() {
  const currentDomain = window.location.hostname;
  const allowedDomains = ['localhost', '127.0.0.1', 'shenming.site']; // 添加你的域名
  
  console.log('当前域名:', currentDomain);
  
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1' || currentDomain.includes('github.io')) {
    console.log('✅ 在本地或GitHub Pages环境中运行');
    return true;
  }
  
  // 检查是否在允许的域名中
  const isAllowed = allowedDomains.some(domain => 
    currentDomain === domain || currentDomain.endsWith('.' + domain)
  );
  
  if (!isAllowed) {
    console.warn('⚠️ 当前域名可能不在Turnstile配置的域名列表中');
  }
  
  return isAllowed;
}

// 页面加载时进行检查
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 开始Turnstile配置检查...');
  
  // 检查域名
  validateDomain();
  
  // 检查sitekey
  const turnstileDiv = document.querySelector('.cf-turnstile');
  if (turnstileDiv) {
    const sitekey = turnstileDiv.getAttribute('data-sitekey');
    console.log('Sitekey:', sitekey);
    
    if (sitekey === '0x4AAAAAAAYourSiteKeyHere') {
      console.error('❌ 仍在使用占位符sitekey');
    } else if (sitekey && sitekey.length > 10) {
      console.log('✅ Sitekey已配置');
    }
  }
});

// 添加日志记录功能，将Turnstile验证结果发送到后端服务
async function logTurnstileEvent(eventType, eventData) {
  try {
    const response = await fetch('/log-turnstile-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      console.error('日志记录失败:', response.statusText);
    }
  } catch (error) {
    console.error('日志记录时发生错误:', error);
  }
}
