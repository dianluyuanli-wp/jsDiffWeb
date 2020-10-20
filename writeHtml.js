const fs = require('fs');
const path = require('path');

const FILE_TYPE = {
  JS: 0,
  CSS: 1
};

//  获取版本
var newVersion = require('./package.json').version;

function getTagWithCDN(fileName, type = FILE_TYPE.JS) {
  const url = `https://cdn.jsdelivr.net/gh/dianluyuanli-wp/diffDist@${newVersion}/${fileName}`;
  return type === FILE_TYPE.JS ? `<script src="${url}" type="text/javascript"></script>` : `<link rel="stylesheet" href="${url}" >`;
}
//  读取原始模板内容
const HTMLTemplate = path.resolve(__dirname, "./view/template.html"); // 大文件存储目录
const oldContent = fs.readFileSync(HTMLTemplate, 'utf8');
//  替换标签
const newContent = oldContent.replace('<app_bundle />', getTagWithCDN('app.bundle.js'))
  .replace('<common_bundle />', getTagWithCDN('common.bundle.js')).replace('<app_css />', getTagWithCDN('app.css', FILE_TYPE.CSS))
  .replace('<common_css />', getTagWithCDN('common.css', FILE_TYPE.CSS));
//  生成最终的结果:替换cdn源之后的html文件
fs.writeFileSync('dist/index.html', newContent, 'utf8');
