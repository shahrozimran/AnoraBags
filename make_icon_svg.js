const fs = require('fs');
const path = require('path');

const appleIconPath = path.join(__dirname, 'public', 'apple-icon.png');
const b64 = fs.readFileSync(appleIconPath).toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <clipPath id="squircle">
      <rect width="180" height="180" rx="36" />
    </clipPath>
  </defs>
  <rect width="180" height="180" rx="36" fill="#ECE2D8" />
  <image href="data:image/png;base64,${b64}" width="180" height="180" clip-path="url(#squircle)" />
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'icon.svg'), svgContent, 'utf-8');
console.log('icon.svg updated successfully');
