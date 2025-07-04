// 假设你的 content 按钮有 id="contentBtn"
document.getElementById('contentBtn').addEventListener('click', function() {
  document.body.classList.add('content-mode');
});

// 如果你有返回 home 的按钮，比如 id="homeBtn"
document.getElementById('homeBtn').addEventListener('click', function() {
  document.body.classList.remove('content-mode');
});