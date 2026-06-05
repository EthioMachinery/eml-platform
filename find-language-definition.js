const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function findDefinition(currentDir) {
  if (!fs.existsSync(currentDir)) return;
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findDefinition(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for where "type Language" is declared or exported
      if (
        content.includes('type Language =') || 
        content.includes('type Language ') ||
        content.includes('interface Language ') ||
        content.includes('export type Language')
      ) {
        const relativePath = path.relative(__dirname, fullPath);
        console.log(`[FOUND DEFINITION] ${relativePath}`);
      }
    }
  }
}

console.log("Searching for the definition of 'Language' type...");
findDefinition(targetDir);