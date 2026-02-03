const fs = require('fs');
const path = require('path');

console.log('Ì¥ß Fixing syntax errors in Prisma update calls...\n');

// Fix 1: app/api/addresses/[id]/route.ts
const file1 = 'app/api/addresses/[id]/route.ts';
try {
  const content1 = fs.readFileSync(file1, 'utf8');
  const fixed1 = content1.replace(
    'await db.address.update({ where: { id: addr.id }, data: { isDefault: false })',
    'await db.address.update({ where: { id: addr.id }, data: { isDefault: false } })'
  );
  fs.writeFileSync(file1, fixed1, 'utf8');
  console.log('‚úÖ Fixed: app/api/addresses/[id]/route.ts');
} catch (error) {
  console.log(`‚ùå Error fixing ${file1}: ${error.message}`);
}

// Fix 2: app/api/addresses/route.ts
const file2 = 'app/api/addresses/route.ts';
try {
  const content2 = fs.readFileSync(file2, 'utf8');
  const fixed2 = content2.replace(
    'await db.address.update({ where: { id: addr.id }, data: { isDefault: false })',
    'await db.address.update({ where: { id: addr.id }, data: { isDefault: false } })'
  );
  fs.writeFileSync(file2, fixed2, 'utf8');
  console.log('‚úÖ Fixed: app/api/addresses/route.ts');
} catch (error) {
  console.log(`‚ùå Error fixing ${file2}: ${error.message}`);
}

// Fix 3: app/api/cart/route.ts
const file3 = 'app/api/cart/route.ts';
try {
  const content3 = fs.readFileSync(file3, 'utf8');
  // This line needs to add the value for quantity and close braces
  const fixed3 = content3.replace(
    'const updated = await db.cartItem.update({ where: { id: itemId }, data: { quantity })',
    'const updated = await db.cartItem.update({ where: { id: itemId }, data: { quantity: quantity } })'
  );
  fs.writeFileSync(file3, fixed3, 'utf8');
  console.log('‚úÖ Fixed: app/api/cart/route.ts');
} catch (error) {
  console.log(`‚ùå Error fixing ${file3}: ${error.message}`);
}

console.log('\nÌæâ Syntax errors fixed!');
console.log('\nÌ≥ù Next: Run "npm run build" to test.');
