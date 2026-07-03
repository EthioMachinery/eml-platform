const fs = require('fs');
const path = require('path');

// Expanded target directory to cover the entire src folder (components, hooks, lib, and app)
const targetDir = path.join(__dirname, 'src');

const patterns = [
  /const\s*\{\s*t\s*\}\s*=\s*useLanguage\s*\(\s*\)\s*;?/g,
  /const\s*\{\s*t\s*,\s*language\s*\}\s*=\s*useLanguage\s*\(\s*\)\s*;?/g,
  /const\s*\{\s*language\s*,\s*t\s*\}\s*=\s*useLanguage\s*\(\s*\)\s*;?/g
];

const replacement = `const { language } = useLanguage();\n\n  // Local helper to translate dual-strings\n  const t = (en, am) => {\n    return language === "am" ? am : en;\n  };`;

function fixFiles(currentDir) {
  if (!fs.existsSync(currentDir)) return;

  const items = fs.readdirSync(currentDir);

  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        const relativePath = path.relative(__dirname, fullPath);
        console.log(`\x1b[32m[FIXED]\x1b[0m ${relativePath}`);
      }
    }
  }
}

console.log("====================================================");
console.log("TM GLOBAL TRANSLATION CODEMOD - ACTIVE");
console.log("====================================================");

fixFiles(targetDir);

console.log("====================================================");
console.log("GLOBAL AUTO-REFACTOR COMPLETE.");
console.log("====================================================");