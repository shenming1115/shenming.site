// 当页面加载时，弹出警告框
window.onload = function () {
  alert('Welcome to Shenming Site!');
};

// 播放音频并增加音量
document.getElementById('playButton').onclick = function () {
  const audioPlayer = document.getElementById('audioPlayer');
  audioPlayer.volume = 1.0;  // 设置音量为最大（1.0）
  audioPlayer.play();
};
