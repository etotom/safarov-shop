const fs = require('fs');
const path = require('path');

console.log('Ì¥Ñ Converting Prisma update syntax to 2-argument style...\n');

// Find all TypeScript files
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const tsFiles = findTsFiles('app');
let fixedCount = 0;

tsFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Pattern 1: update({ where: { ... }, data: { ... } })
    // Convert to: update({ ... }, { ... })
    const updateRegex = /db\.(\w+)\.update\(\s*\{\s*where:\s*\{([^}]+)\}\s*,\s*data:\s*\{([^}]+)\}\s*\}\)/g;
    
    content = content.replace(updateRegex, (match, table, whereClause, dataClause) => {
      changed = true;
      // Extract just the conditions from where clause
      const whereConditions = whereClause.replace(/\s+/g, ' ').trim();
      return `db.${table}.update({ ${whereConditions} }, { ${dataClause} })`;
    });
    
    // Pattern 2: update({ where: { id: X }, data: { ... } })
    // Convert to: update({ id: X }, { ... })
    const updateWithIdRegex = /db\.(\w+)\.update\(\s*\{\s*where:\s*\{\s*id:\s*([^,}]+)\s*\}\s*,\s*data:\s*\{([^}]+)\}\s*\}\)/g;
    
    content = content.replace(updateWithIdRegex, (match, table, idValue, dataClause) => {
      changed = true;
      return `db.${table}.update({ id: ${idValue.trim()} }, { ${dataClause.trim()} })`;
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`‚úÖ Fixed: ${filePath}`);
      fixedCount++;
    }
    
  } catch (error) {
    // Skip files we can't read
  }
});

console.log(`\nÌæâ Fixed ${fixedCount} files.`);
console.log('\nÌ≥ù Note: Changed Prisma update syntax from:');
console.log('   db.table.update({ where: { id: X }, data: { ... } })');
console.log('To:');
console.log('   db.table.update({ id: X }, { ... })');
