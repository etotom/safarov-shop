const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/account/page.tsx',
  'app/auth/signin/page.tsx', 
  'app/contact/page.tsx',
  'app/faq/page.tsx',
  'app/not-found.tsx',
  'app/page.tsx',
  'app/returns/page.tsx',
  'app/shipping/page.tsx'
];

filesToFix.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace apostrophes in text content (but not in code/imports)
    // This is a simple fix - you might need to check each replacement
    content = content.replace(/(>.*?)'(.*?<)/g, '$1&apos;$2');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.log(`Error fixing ${filePath}:`, error.message);
  }
});