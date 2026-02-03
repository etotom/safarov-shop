const fs = require('fs');
const path = require('path');

console.log('í´§ Fixing ALL Prisma update calls in the project...\n');

// Function to fix a single file
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    let fixed = content
      // Fix: update({ id: X, data: { ... } }) -> update({ id: X }, { ... })
      .replace(
        /db\.(\w+)\.update\(\s*\{\s*id:\s*([^,]+?)\s*,\s*data:\s*\{([^}]+(?:\}[^}]+)*?)\}\s*\}\)/gs,
        'db.$1.update({ id: $2 }, { $3 })'
      )
      // Fix: update({ id: X, data: { ... } }) with simpler pattern
      .replace(
        /db\.(\w+)\.update\(\s*\{\s*id:\s*([^,]+?)\s*,\s*data:\s*\{([^}]+)\}\s*\}\)/g,
        'db.$1.update({ id: $2 }, { $3 })'
      );
    
    if (fixed !== originalContent) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`âœ… Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`âŒ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Find and fix all TypeScript files
const appDir = 'app';
const tsFiles = [];

function findTsFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      findTsFiles(fullPath);
    } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
      tsFiles.push(fullPath);
    }
  }
}

findTsFiles(appDir);

let fixedCount = 0;
tsFiles.forEach(file => {
  if (fixFile(file)) fixedCount++;
});

console.log(`\ní¾‰ Fixed ${fixedCount} files.`);
console.log('\ní³ Next: Run "npm run build" to test.');
