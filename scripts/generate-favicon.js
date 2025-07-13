import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 简单的favicon生成脚本
// 这个脚本创建一个基本的32x32像素的favicon

function generateFavicon() {
  // 创建一个简单的SVG字符串，然后我们可以转换为ICO
  const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
  <rect width="16" height="16" rx="2" fill="#0ea5e9"/>
  <g stroke="white" stroke-width="1" stroke-linecap="round">
    <path d="M3 5l1.5 3L3 11"/>
    <path d="M13 5l-1.5 3L13 11"/>
    <path d="M7 11l2-6"/>
  </g>
</svg>`.trim();

  // 将SVG写入到public目录
  const publicDir = path.join(__dirname, '..', 'public');
  const faviconPath = path.join(publicDir, 'favicon-16.svg');
  
  // 确保public目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(faviconPath, faviconSvg);
  
  console.log('✅ Favicon generated successfully!');
  console.log('📁 Location:', faviconPath);
  console.log('💡 To convert to ICO format, you can use online tools like:');
  console.log('   - https://favicon.io/favicon-converter/');
  console.log('   - https://convertio.co/svg-ico/');
  console.log('   - Or install npm package: npm install -g svg2ico');
}

generateFavicon();

export { generateFavicon }; 