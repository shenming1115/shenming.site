// 自动混淆脚本配置
// 使用 terser、clean-css、html-minifier-terser
module.exports = {
  js: {
    input: './script.js',
    output: './dist/script.min.js',
    options: {
      mangle: true,
      compress: true,
      output: { comments: false }
    }
  },
  css: {
    input: './styles.css',
    output: './dist/styles.min.css'
  },
  html: {
    input: './index.html',
    output: './dist/index.min.html',
    options: {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }
  }
};
