// --- Global State and Configuration ---

let devToolsDetected = false;
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

// --- Core Functions ---

// Fetch Malaysia Time and IP
async function fetchMalaysiaTimeAndIP() {
  // Fetch Malaysia Time
  try {
    const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kuala_Lumpur');
    const data = await res.json();
    const malaysiaTime = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')} ${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}:${String(data.seconds).padStart(2, '0')} (MY)`;
    document.getElementById('preVerifyDatetime').textContent = malaysiaTime;
    window._malaysiaTime = malaysiaTime;
  } catch (e) {
    document.getElementById('preVerifyDatetime').textContent = 'Could not fetch Malaysia time';
    window._malaysiaTime = '';
    console.error('Failed to fetch Malaysia time', e);
  }

  // Fetch IP Address
  let ipv4 = '', ipv6 = '';
  try {
    const ipRes4 = await fetch('https://api.myip.com/');
    const ipData4 = await ipRes4.json();
    ipv4 = ipData4.ip;
    window._userIPv4 = ipv4;
  } catch (e) { console.error('Failed to fetch IPv4', e); }

  try {
    const ipRes6 = await fetch('https://cloudflare.com/cdn-cgi/trace');
    const text6 = await ipRes6.text();
    const ipMatch = text6.match(/ip=([^\n]+)/);
    if (ipMatch && ipMatch[1] && ipMatch[1].includes(':')) {
      ipv6 = ipMatch[1];
    }
    window._userIPv6 = ipv6;
  } catch (e) { console.error('Failed to fetch IPv6', e); }

  // Display IP Info
  let ipInfoStr = '';
  if (ipv4) ipInfoStr += 'IPv4: ' + ipv4;
  if (ipv6) ipInfoStr += (ipInfoStr ? '<br>' : '') + 'IPv6: ' + ipv6;
  if (!ipInfoStr) ipInfoStr = 'IP: Not available';
  document.getElementById('ipInfo').innerHTML = ipInfoStr;
  window._userIP = ipv4 || ipv6 || '';

  // Update content page IP/Time
  if (document.getElementById('contentDatetime')) {
    document.getElementById('contentDatetime').textContent = window._malaysiaTime ? ('Malaysia Time: ' + window._malaysiaTime) : 'Could not fetch Malaysia time';
  }
  if (document.getElementById('contentIP')) {
    document.getElementById('contentIP').textContent = ipInfoStr;
  }
}

// Handle successful Turnstile verification
function handleTurnstileSuccess(token) {
  console.log('Turnstile verification successful', token);
  document.getElementById('preVerifyMask').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
  document.body.classList.add('after-verify-bg');

  document.getElementById('mainWelcome').textContent = 'Welcome to MyWebsite';
  if (window._malaysiaTime) {
    document.getElementById('mainDatetime').textContent = 'Malaysia Time: ' + window._malaysiaTime;
  } else {
    document.getElementById('mainDatetime').textContent = 'Could not fetch Malaysia time';
  }

  let ipStr = '';
  if (window._userIPv4) ipStr += 'IPv4: ' + window._userIPv4;
  if (window._userIPv6) ipStr += (ipStr ? ' / ' : '') + 'IPv6: ' + window._userIPv6;
  document.getElementById('mainIP').textContent = ipStr ? 'Your IP: ' + ipStr : 'IP: Not available';
  document.getElementById('mainIP').style.display = 'block';

  setTimeout(() => {
    const homeElement = document.querySelector('#home');
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

// Set Turnstile callbacks
window.onTurnstileSuccess = handleTurnstileSuccess;

window.onTurnstileExpired = function() {
  console.log('⚠️ Turnstile verification expired');
  const verificationResult = document.getElementById('verificationResult');
  if (verificationResult) {
    verificationResult.innerHTML = '<span style="color: #FF9800;">⚠️ Verification has expired, please verify again.</span>';
  }
};

window.onTurnstileError = function(error) {
  console.error('❌ Turnstile verification error:', error);
  const verificationResult = document.getElementById('verificationResult');
  if (verificationResult) {
    verificationResult.innerHTML = `<span style="color: #F44336;">❌ Verification failed: ${error}</span>`;
  }
};

// --- Anti-Debugging and Security ---

// Centralized anti-DevTools function
function antiDevTools() {
  if (devToolsDetected) return;
  devToolsDetected = true;
  console.warn("Developer tools detected. Further interaction may be restricted.");
}

// Security event logger (placeholder)
function logSecurityEvent(event, data) {
  console.log(`[Security Event] ${event}:`, data);
}

// Initialize all security features
function initializeSecurity() {
  // Anti-debugging
  let consoleCount = 0;
  console.log = console.warn = console.error = console.info = function() {
    consoleCount++;
    if (consoleCount > 20) antiDevTools();
    return false;
  };
  
  const timeCheck = () => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) antiDevTools();
  };
  setInterval(timeCheck, 5000);

  // Keyboard shortcut detection
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
      e.preventDefault();
      antiDevTools();
    }
  });

  // Right-click detection
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    antiDevTools();
  });
}

// --- Page Animations and Interactions ---

// Animate pre-verification background
function animatePreVerifyBg() {
  const preVerifyColors = [
    [30, 60, 114], [42, 82, 152], [106, 17, 203], [37, 117, 252], [67, 206, 162],
    [24, 90, 157], [247, 151, 30], [255, 210, 0], [253, 29, 29], [131, 58, 180], [252, 176, 69]
  ];
  let t = 0;
  const mask = document.getElementById('preVerifyMask');
  if (!mask) return;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function rgbArrToStr(arr) { return `rgb(${arr[0]},${arr[1]},${arr[2]})`; }

  function animate() {
    if (document.getElementById('preVerifyMask').style.display === 'none') return;
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
    t += 0.01;
    requestAnimationFrame(animate);
  }
  animate();
}

// Starry night animation
function drawStarSea() {
  const canvas = document.getElementById('starryNightCanvas');
  if (!canvas || canvas._starSeaStarted) return;
  canvas._starSeaStarted = true;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    W = canvas.width;
    H = canvas.height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const STAR_COUNT = 800;
  const CLOUD_CENTER = { x: W / 2, y: H / 2 };
  const RADIUS_MIN = Math.min(W, H) * 0.18;
  const RADIUS_MAX = Math.min(W, H) * 0.46;
  const ROTATE_SPEED = 0.0007;
  const STAR_COLORS = ["#fffbe7", "#ffe066", "#fff", "#f9f871", "#b3e0ff", "#6ec6ff", "#3a5aee"];
  const stars = [];

  for (let i = 0; i < STAR_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = RADIUS_MIN + Math.pow(Math.random(), 1.7) * (RADIUS_MAX - RADIUS_MIN);
    stars.push({
      baseAngle: angle,
      orbit: r,
      color: STAR_COLORS[i % STAR_COLORS.length],
      size: 1.2 + Math.random() * 1.8,
      cloudOffset: Math.random() * Math.PI * 2,
      cloudSpeed: 0.0002 + Math.random() * 0.0005
    });
  }

  let frame = 0;
  function animate() {
    if (document.body.classList.contains('animation-mode') === false) {
      canvas._starSeaStarted = false;
      return;
    }
    frame++;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0c18";
    ctx.fillRect(0, 0, W, H);

    stars.forEach(star => {
      const cloudAngle = star.baseAngle + frame * star.cloudSpeed + Math.sin(frame * 0.002 + star.cloudOffset) * 0.12;
      const angle = cloudAngle + frame * ROTATE_SPEED;
      star.x = CLOUD_CENTER.x + Math.cos(angle) * star.orbit;
      star.y = CLOUD_CENTER.y + Math.sin(angle) * star.orbit;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 16;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Refresh Turnstile function
window.refreshTurnstile = function() {
  console.log('🔄 Reloading Turnstile verification');
  
  try {
    const verificationResult = document.getElementById('verificationResult');
    if(verificationResult) {
      verificationResult.innerHTML = '<span style="color: #6c757d;">🔄 Reloading verification...</span>';
    }
    
    if (window.turnstile) {
      const turnstileDiv = document.querySelector('.cf-turnstile');
      if (turnstileDiv) {
        turnstileDiv.innerHTML = '';
        setTimeout(() => {
          window.turnstile.render(turnstileDiv, {
            sitekey: '0x4AAAAAABjTIyITvZEz6LO_',
            theme: 'dark',
            size: 'normal',
            callback: 'onTurnstileSuccess',
            'expired-callback': 'onTurnstileExpired',
            'error-callback': 'onTurnstileError'
          });
          
          if(verificationResult) {
            verificationResult.innerHTML = '<span style="color: #4CAF50;">✅ Verification reloaded</span>';
          }
        }, 500);
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = function() {
        console.log('✅ Turnstile script reloaded successfully');
        if(verificationResult) {
          verificationResult.innerHTML = '<span style="color: #4CAF50;">✅ Verification service reloaded</span>';
        }
      };
      script.onerror = function() {
        console.error('❌ Turnstile script reload failed');
        if(verificationResult) {
          verificationResult.innerHTML = '<span style="color: #F44336;">❌ Failed to reload verification service</span>';
        }
      };
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error('❌ Error while reloading verification:', error);
  }
};

// --- Main Event Listener ---

document.addEventListener('DOMContentLoaded', function() {
  // Initialize security features
  initializeSecurity();

  // Fetch initial data
  fetchMalaysiaTimeAndIP();
  
  // Start pre-verify animation
  animatePreVerifyBg();

  // --- Element Selectors ---
  const playButton = document.getElementById('playButton');
  const audioPlayer = document.getElementById('audioPlayer');
  const modeBtn = document.getElementById('toggleMode');
  const navbar = document.querySelector('.navbar');
  const contentNav = document.getElementById('contentNav');
  const animationNav = document.getElementById('animationNav');
  const backHomeBtn = document.getElementById('backHomeBtn');
  const backHomeBtnAnim = document.getElementById('backHomeBtnAnim');
  const contentRect = document.querySelector('#contentPage .content-rect');

  // --- Event Bindings ---

  // Audio player
  if (playButton && audioPlayer) {
    playButton.onclick = () => audioPlayer.play();
  }

  // Eye tracking
  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll('.eye').forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      if (!pupil) return;
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const radius = 10;
      pupil.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`;
    });
  });

  // Blinking effect
  setInterval(() => {
    document.querySelectorAll('.eye').forEach(eye => {
      eye.classList.add('blinking');
      setTimeout(() => eye.classList.remove('blinking'), 250);
    });
  }, 4000);

  // Dark mode toggle
  if (modeBtn) {
    const updateModeBtn = () => {
      modeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    };
    if (localStorage.getItem('dark-mode') === 'true') {
      document.body.classList.add('dark-mode');
    }
    updateModeBtn();
    modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
      updateModeBtn();
    });
  }

  // Navbar transparency on scroll
  if (navbar) {
    const updateNavbarTransparency = () => {
      navbar.classList.toggle('transparent', window.scrollY > 30);
    };
    window.addEventListener('scroll', updateNavbarTransparency, { passive: true });
    updateNavbarTransparency();
  }

  // Page navigation
  const resetPageModes = () => {
    document.body.classList.remove('content-mode', 'animation-mode');
    document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
  };

  if (contentNav) {
    contentNav.addEventListener('click', (e) => {
      e.preventDefault();
      resetPageModes();
      document.body.classList.add('content-mode');
      contentNav.classList.add('active');
      if (contentRect) contentRect.classList.add('collapsed');
    });
  }

  if (animationNav) {
    animationNav.addEventListener('click', (e) => {
      e.preventDefault();
      resetPageModes();
      document.body.classList.add('animation-mode');
      animationNav.classList.add('active');
      drawStarSea();
    });
  }
  
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', resetPageModes);
  }

  if (backHomeBtnAnim) {
    backHomeBtnAnim.addEventListener('click', resetPageModes);
  }
  
  document.querySelectorAll('.navbar-links a[href^="#"]').forEach(link => {
    if (link.id !== 'contentNav' && link.id !== 'animationNav') {
      link.addEventListener('click', resetPageModes);
    }
  });

  // Content page interaction
  if (contentRect) {
    contentRect.addEventListener('click', (e) => {
      if (contentRect.classList.contains('collapsed')) {
        contentRect.classList.remove('collapsed');
        e.stopPropagation();
      }
    });
  }
});
  
  // Behavior monitoring object
  const behaviorMonitor = {
    mousePoints: [],
    clickTimes: [],
    keyPressTimes: [],
    scrollEvents: [],
    
    // Track mouse movement
    trackMouseMovement: function(e) {
      this.mousePoints.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      
      // Keep only recent points
      if (this.mousePoints.length > 100) {
        this.mousePoints.shift();
      }
    },
    
    // Track clicks
    trackClick: function(e) {
      this.clickTimes.push(Date.now());
      if (this.clickTimes.length > 50) {
        this.clickTimes.shift();
      }
    },
    
    // Track keyboard
    trackKeypress: function(e) {
      this.keyPressTimes.push(Date.now());
      if (this.keyPressTimes.length > 50) {
        this.keyPressTimes.shift();
      }
    },
    
    // Track scroll
    trackScroll: function(e) {
      this.scrollEvents.push(Date.now());
      if (this.scrollEvents.length > 50) {
        this.scrollEvents.shift();
      }
    },
    
    // Setup honeypot
    setupHoneyPot: function() {
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
      
      // If there's interaction, it's a bot
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
    
    // Record suspicious activity
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
// NOTE: This commented-out block is incorrect and has been superseded by the handleTurnstileSuccess function above.
// It is kept here for reference but should be ignored.
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
  console.log('⚠️ Turnstile verification expired');
  securityState.turnstileVerified = false;
  const verifyBtn = document.getElementById('verifyBtn');
  if(verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.style.opacity = '0.5';
  }
  const verificationResult = document.getElementById('verificationResult');
  if(verificationResult) {
    verificationResult.innerHTML = 
    '<span style="color: #FF9800;">⚠️ Verification has expired, please verify again.</span>';
  }
};

window.onTurnstileError = function(error) {
  console.error('❌ Turnstile verification error:', error);

  let errorMessage = '';
  switch(error) {
    case 'network-error':
      errorMessage = '❌ Network connection error, please check your network and try again.';
      break;
    case 'timeout':
      errorMessage = '❌ Verification timed out, please refresh the page and try again.';
      break;
    case 'invalid-sitekey':
      errorMessage = '❌ Site configuration error, please contact the administrator.';
      break;
    case 'invalid-domain':
      errorMessage = '❌ Domain mismatch, please check the site configuration.';
      break;
    case 'rate-limit':
      errorMessage = '❌ Too many requests, please try again later.';
      break;
    default:
      errorMessage = '❌ Verification failed: ' + error;
  }
  const verificationResult = document.getElementById('verificationResult');
  if(verificationResult) {
    verificationResult.innerHTML = 
    '<span style="color: #F44336;">' + errorMessage + '</span>';
  }

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
  console.log('🔄 Reloading Turnstile verification');
  
  try {
    // 重置验证状态
    securityState.turnstileVerified = false;
    const verifyBtn = document.getElementById('verifyBtn');
    if(verifyBtn) {
      verifyBtn.disabled = true;
      verifyBtn.style.opacity = '0.5';
    }
    const verificationResult = document.getElementById('verificationResult');
    if(verificationResult) {
      verificationResult.innerHTML = 
      '<span style="color: #6c757d;">🔄 Reloading verification...</span>';
    }
    
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
          
          const verificationResult = document.getElementById('verificationResult');
          if(verificationResult) {
            verificationResult.innerHTML = 
            '<span style="color: #4CAF50;">✅ Verification reloaded</span>';
          }
        }, 500);
      }
    } else {
      // 如果Turnstile未加载，尝试重新加载脚本
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = function() {
        console.log('✅ Turnstile script reloaded successfully');
        const verificationResult = document.getElementById('verificationResult');
        if(verificationResult) {
          verificationResult.innerHTML = 
          '<span style="color: #4CAF50;">✅ Verification service reloaded</span>';
        }
      };
      script.onerror = function() {
        console.error('❌ Turnstile script reload failed');
        const verificationResult = document.getElementById('verificationResult');
        if(verificationResult) {
          verificationResult.innerHTML = 
          '<span style="color: #F44336;">❌ Failed to reload verification service</span>';
        }
      };
      document.head.appendChild(script);
    }
    
    logSecurityEvent('turnstile_refresh', {
      timestamp: new Date().toISOString(),
      reason: 'manual_refresh'
    });
    
  } catch (error) {
    console.error('❌ Error while reloading verification:', error);
    const verificationResult = document.getElementById('verificationResult');
    if(verificationResult) {
      verificationResult.innerHTML = 
      '<span style="color: #F44336;">❌ Reload failed, please refresh the page</span>';
    }
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
    console.log('❌ Reached maximum retry attempts');
    const verificationResult = document.getElementById('verificationResult');
    if(verificationResult) {
      verificationResult.innerHTML = 
      '<span style="color: #F44336;">❌ Verification service connection failed, please check your network and refresh the page.</span>';
    }
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

  // 夜间模式切换（全局应用到每个页面）
document.addEventListener('DOMContentLoaded', function() {
  const modeBtn = document.getElementById('toggleMode');
  // 初始化按钮状态和body类
  function updateModeBtn() {
    modeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  }
  // 检查本地存储
  if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  updateModeBtn();
  // 切换深色模式
  modeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    updateModeBtn();
  });
  // 监听模式变化，确保所有页面都应用
  const observer = new MutationObserver(() => {
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    updateModeBtn();
    // 额外：同步所有主要内容区的深色样式
    document.querySelectorAll('.content, .content-page, .section, .animation-page').forEach(el => {
      if (document.body.classList.contains('dark-mode')) {
        el.classList.add('dark-mode');
      } else {
        el.classList.remove('dark-mode');
      }
    });
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  // 首次加载时同步
  document.querySelectorAll('.content, .content-page, .section, .animation-page').forEach(el => {
    if (document.body.classList.contains('dark-mode')) {
      el.classList.add('dark-mode');
    } else {
      el.classList.remove('dark-mode');
    }
  });
});

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
      const verificationResult = document.getElementById('verificationResult');
      if(verificationResult) {
        verificationResult.innerHTML = 
        '<span style="color: #FF9800;">⚠️ Verification service is loading, please wait...</span>';
      }
        
      // 再次检查
      setTimeout(function() {
        if (!checkTurnstileStatus()) {
          const verificationResult = document.getElementById('verificationResult');
          if(verificationResult) {
            verificationResult.innerHTML = 
            '<span style="color: #F44336;">❌ Failed to load verification service, please check your network connection.</span>';
          }
        } else {
          const verificationResult = document.getElementById('verificationResult');
          if(verificationResult) {
            verificationResult.innerHTML = 
            '<span style="color: #4CAF50;">✅ Verification service is ready.</span>';
          }
        }
      }, 5000);
    }
  }, 2000);
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

document.addEventListener('DOMContentLoaded', function() {
  // Content导航切换
  var contentNav = document.getElementById('contentNav');
  var contentRect = document.querySelector('#contentPage .content-rect');
  var backHomeBtn = document.getElementById('backHomeBtn');
  var animationNav = document.getElementById('animationNav');
  var animationPage = document.getElementById('animationPage');
  var animationRect = document.getElementById('animationRect');
  var backHomeBtnAnim = document.getElementById('backHomeBtnAnim');

  // 切换到content
  if (contentNav) {
    contentNav.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.add('content-mode');
      document.body.classList.remove('animation-mode');
      document.querySelectorAll('.navbar-links a').forEach(a => {
        a.classList.toggle('active', a.id === 'contentNav');
      });
      if (contentRect) contentRect.classList.add('collapsed');
    });
  }
  // 切换到animation
  if (animationNav) {
    animationNav.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.add('animation-mode');
      document.body.classList.remove('content-mode');
      document.querySelectorAll('.navbar-links a').forEach(a => {
        a.classList.toggle('active', a.id === 'animationNav');
      });
      // 直接展开动画，不显示“老子的星海”卡片
      if (animationRect) {
        animationRect.classList.remove('collapsed');
        // 隐藏卡片内容（不显示任何文字/按钮/提示）
        animationRect.style.display = 'none';
      }
      drawStarSea();
    });
  }
  // 返回主页按钮
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', function() {
      document.body.classList.remove('content-mode');
      document.body.classList.remove('animation-mode');
      document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
    });
  }
  if (backHomeBtnAnim) {
    backHomeBtnAnim.addEventListener('click', function() {
      document.body.classList.remove('animation-mode');
      document.body.classList.remove('content-mode');
      document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
    });
  }
  // 其它导航回主页时关闭 content/animation
  document.querySelectorAll('.navbar-links a[href^="#"]').forEach(link => {
    if(link.id !== 'contentNav' && link.id !== 'animationNav') {
      link.addEventListener('click', function() {
        document.body.classList.remove('content-mode');
        document.body.classList.remove('animation-mode');
        document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
      });
    }
  });

  // 点击 content-rect 展开冷笑话内容
  if (contentRect) {
    contentRect.addEventListener('click', function(e) {
      if (contentRect.classList.contains('collapsed')) {
        contentRect.classList.remove('collapsed');
        e.stopPropagation();
      }
    });
  }
  // 点击 animation-rect 展开并绘制星空
  if (animationRect) {
    animationRect.addEventListener('click', function(e) {
      if (animationRect.classList.contains('collapsed')) {
        animationRect.classList.remove('collapsed');
        drawStarSea();
        e.stopPropagation();
      }
    });
  }
});

// Animation page 星空动画（极限多星云，极限黑洞感，性能极限）
function drawStarSea() {
  const canvas = document.getElementById('starryNightCanvas');
  if (!canvas) return;
  if (canvas._starSeaStarted) return;
  canvas._starSeaStarted = true;

  function resizeCanvas() {
    canvas.removeAttribute('style');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width;
  let H = canvas.height;

  // 星云参数
  const STAR_COUNT = 800;
  const CLOUD_CENTER = { x: W / 2, y: H / 2 };
  const RADIUS_MIN = Math.min(W, H) * 0.18;
  const RADIUS_MAX = Math.min(W, H) * 0.46;
  const ROTATE_SPEED = 0.0007;
  const STAR_COLORS = [
    "#fffbe7", "#ffe066", "#fff", "#f9f871", "#b3e0ff", "#6ec6ff", "#3a5aee"
  ];

  // 极限多星云
  const NEBULA_COUNT = 32; // 极限数量，建议不要再高
  const NEBULA_COLORS = [
    "rgba(110,198,255,0.13)", "rgba(255,224,102,0.10)", "rgba(255,251,231,0.09)", "rgba(58,90,140,0.13)",
    "rgba(131,58,180,0.12)", "rgba(37,117,252,0.10)", "rgba(252,176,69,0.10)",
    "rgba(255,255,255,0.09)", "rgba(67,206,162,0.10)", "rgba(253,29,29,0.09)"
  ];
  const nebulas = [];
  for (let i = 0; i < NEBULA_COUNT; i++) {
    const angle = (i / NEBULA_COUNT) * Math.PI * 2 + Math.random() * 0.5;
    const r = (RADIUS_MIN + RADIUS_MAX) / 2 + Math.sin(i * 1.7) * 60 + Math.random() * 60;
    const cx = CLOUD_CENTER.x + Math.cos(angle) * r * (0.7 + Math.random() * 0.3);
    const cy = CLOUD_CENTER.y + Math.sin(angle) * r * (0.7 + Math.random() * 0.3);
    const color = NEBULA_COLORS[i % NEBULA_COLORS.length];
    const size = 160 + Math.random() * 180;
    const speed = 0.00013 + Math.random() * 0.00025;
    const phase = Math.random() * Math.PI * 2;
    nebulas.push({cx, cy, color, size, speed, phase});
  }

  // 生成星点分布（云状分布，带有随机扰动）'
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const t = Math.pow(Math.random(), 1.7);
    const r = RADIUS_MIN + t * (RADIUS_MAX - RADIUS_MIN) + Math.sin(i) * 8;
    const color = STAR_COLORS[i % STAR_COLORS.length];
    const size = 1.2 + Math.random() * 1.8;
    const phase = Math.random() * Math.PI * 2;
    const orbit = r;
    stars.push({
      baseAngle: angle,
      orbit,
      color,
      size,
      phase,
      cloudOffset: Math.random() * Math.PI * 2,
      cloudSpeed: 0.0002 + Math.random() * 0.0005
    });
  }

  const LINK_DIST = Math.min(W, H) * 0.07;

  let frame = 0;
  let lastTime = performance.now();
  function animate(now) {
    if (now - lastTime < 66) {
      requestAnimationFrame(animate);
      return;
    }
    lastTime = now;
    W = canvas.width;
    H = canvas.height;
    frame++;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0a0c18";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 绘制极限多黑洞星云
    for (let n of nebulas) {
      let angle = frame * n.speed + n.phase;
      let x = n.cx + Math.cos(angle) * 24;
      let y = n.cy + Math.sin(angle) * 24;
      ctx.save();
      ctx.globalAlpha = 0.18 + 0.08 * Math.abs(Math.sin(frame * 0.008 + n.phase));
      ctx.beginPath();
      ctx.ellipse(
        x, y,
        n.size * (0.9 + 0.2 * Math.sin(frame * 0.01 + n.phase)),
        n.size * (0.5 + 0.2 * Math.cos(frame * 0.012 + n.phase)),
        angle,
        0, Math.PI * 2
      );
      ctx.fillStyle = n.color;
      ctx.filter = "blur(2.5px)";
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();
    }

    // 计算星点新位置（整体旋转+云状扰动）
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = stars[i];
      const cloudAngle = star.baseAngle + frame * star.cloudSpeed + Math.sin(frame * 0.002 + star.cloudOffset) * 0.12;
      const rotate = frame * ROTATE_SPEED;
      const angle = cloudAngle + rotate;
      star.x = CLOUD_CENTER.x + Math.cos(angle) * star.orbit;
      star.y = CLOUD_CENTER.y + Math.sin(angle) * star.orbit;
      star.alpha = 1;
    }

    ctx.save();
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < STAR_COUNT; i++) {
      const a = stars[i];
      for (let j = i + 1; j < i + 8 && j < STAR_COUNT; j++) {
        const b = stars[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.1 - dist / LINK_DIST;
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = stars[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = star.color;
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 32;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// 全局导航栏透明效果（所有页面都显示navbar并随滚动变透明）
// Register Service Worker for caching
// This is now handled in index.html to work with CSP nonce
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       })
//       .catch(error => {
//         console.log('ServiceWorker registration failed: ', error);
//       });
//   });
// }
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  function updateNavbarTransparency() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('transparent');
    } else {
      navbar.classList.remove('transparent');
    }
  }

  // 监听所有页面的滚动
  window.addEventListener('scroll', updateNavbarTransparency, { passive: true });

  // 监听 content/animation 切换时的滚动
  document.addEventListener('scroll', updateNavbarTransparency, { passive: true });

  // 进入content/animation模式时也保证navbar显示
  function ensureNavbarVisible() {
    if (navbar) navbar.style.display = 'flex';
  }
  // 监听模式切换
document.body.addEventListener('classChange', ensureNavbarVisible);
ensureNavbarVisible();

// Register Service Worker for caching
// This is now handled in index.html to work with CSP nonce
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       })
//       .catch(error => {
//         console.log('ServiceWorker registration failed: ', error);
//       });
//   });
// }
  document.body.addEventListener('classChange', ensureNavbarVisible);
ensureNavbarVisible();

});

// Register Service Worker for caching
// This is now handled in index.html to work with CSP nonce
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       })
//       .catch(error => {
//         console.log('ServiceWorker registration failed: ', error);
//       });
//   });
// }
