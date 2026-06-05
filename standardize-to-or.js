const fs = require('fs');
const path = require('path');

// Expanded to cover every single translation configuration file in the project
const filesToUpdate = [
  'src/translations/keys.ts',
  'src/lib/i18n/translations.ts',
  'src/context/LanguageContext.tsx',
  'src/components/LanguageSwitcher.tsx',
  'src/constants/languages.ts',
  'src/lib/i18n/config.ts',
  'src/lib/i18n.ts',
  'src/lib/translate.ts'
];

function standardize() {
  for (const relPath of filesToUpdate) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${relPath}`);
      continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const original = content;

    // 1. Replace 'om' string values
    content = content.replace(/'om'/g, "'or'");
    content = content.replace(/"om"/g, '"or"');
    
    // 2. Replace om: key values in objects
    content = content.replace(/\bom\s*:/g, 'or:');

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`\x1b[32m[STANDARDIZED TO OR]\x1b[0m ${relPath}`);
    }
  }
}

console.log("====================================================");
console.log("EML OROMO CODE STANDARDIZER - ACTIVE");
console.log("====================================================");

standardize();

console.log("====================================================");
console.log("STANDARDIZATION COMPLETE.");
console.log("====================================================");