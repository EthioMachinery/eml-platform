const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'app');

function scanDirectory(currentDir) {
  if (!fs.existsSync(currentDir)) {
    console.error(`Directory not found: ${currentDir}`);
    return;
  }

  const items = fs.readdirSync(currentDir);

  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for the specific bug signature: importing/using useLanguage and destructuring 't'
      const hasBugSignature = content.includes('useLanguage') && 
        (content.includes('const { t }') || content.includes('const {t}'));

      if (hasBugSignature) {
        const relativePath = path.relative(__dirname, fullPath);
        console.log(`\x1b[31m[MISMATCH FOUND]\x1b[0m ${relativePath}`);
      }
    }
  }
}

console.log("====================================================");
console.log("EML TRANSLATION CONTEXT AUDITOR - ACTIVE");
console.log(`Scanning: ${targetDir}`);
console.log("====================================================");

scanDirectory(targetDir);

console.log("====================================================");
console.log("SCAN COMPLETE.");
console.log("====================================================");