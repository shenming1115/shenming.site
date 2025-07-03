// 自动混淆脚本
// 依赖: terser, clean-css, html-minifier-terser
const fs = require('fs');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');
const { minify: minifyHTML } = require('html-minifier-terser');
const config = require('./obfuscate.config');

async function obfuscateJS() {
  const code = fs.readFileSync(config.js.input, 'utf8');
  const result = await minifyJS(code, config.js.options);
  fs.writeFileSync(config.js.output, result.code, 'utf8');
  console.log('JS混淆完成:', config.js.output);
}

function obfuscateCSS() {
  const code = fs.readFileSync(config.css.input, 'utf8');
  const output = new CleanCSS({ level: 2 }).minify(code);
  fs.writeFileSync(config.css.output, output.styles, 'utf8');
  console.log('CSS混淆完成:', config.css.output);
}

async function obfuscateHTML() {
  const code = fs.readFileSync(config.html.input, 'utf8');
  const result = await minifyHTML(code, config.html.options);
  fs.writeFileSync(config.html.output, result, 'utf8');
  console.log('HTML混淆完成:', config.html.output);
}

(async () => {
  await obfuscateJS();
  obfuscateCSS();
  await obfuscateHTML();
})();
