const fs = require('fs');
const path = require('path');

// List of route files to fix
const routeFiles = [
  'app/api/addresses/[id]/route.ts',
  'app/api/admin/categories/[id]/route.ts',
  'app/api/admin/products/[id]/route.ts',
  'app/api/admin/users/[id]/route.ts',
  'app/api/auth/[...nextauth]/route.ts'
];

function fixRouteFile(filePath) {
  try {
    console.log(`\n🔧 Fixing: ${filePath}`);
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️ File not found, skipping...`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Get parameter name from file path
    let paramName = 'id';
    if (filePath.includes('[...nextauth]')) {
      paramName = 'nextauth';
    }
    
    console.log(`   Parameter name: ${paramName}`);
    
    // Fix function signatures for Next.js 16
    // Pattern: { params }: { params: { paramName: type } }
    // Replace with: { params }: { params: Promise<{ paramName: type }> }
    
    // For id routes (string)
    if (paramName === 'id') {
      content = content.replace(
        /\{ params \}: \{ params: \{ id: ([^}]+) \} \}/g,
        '{ params }: { params: Promise<{ id: $1 }> }'
      );
      
      // Replace params.id with (await params).id or destructure
      content = content.replace(
        /const (\w+) = params\.id;/g,
        'const { id } = await params;\n  const $1 = id;'
      );
      
      // Replace direct usage of params.id
      content = content.replace(/params\.id/g, '(await params).id');
    }
    
    // For nextauth routes (string array)
    if (paramName === 'nextauth') {
      content = content.replace(
        /\{ params \}: \{ params: \{ nextauth: ([^}]+) \} \}/g,
        '{ params }: { params: Promise<{ nextauth: $1 }> }'
      );
      
      // Replace params.nextauth
      content = content.replace(/params\.nextauth/g, '(await params).nextauth');
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`   ✅ Fixed successfully`);
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

console.log('🚀 Fixing Next.js 16 route compatibility...');
console.log('===========================================');

routeFiles.forEach(fixRouteFile);

console.log('\n✅ All route files have been updated.');
console.log('\n📝 Next steps:');
console.log('1. Review the changes made to each file');
console.log('2. Test locally with: npm run build');
console.log('3. Commit and push: git add . && git commit -m "Fix Next.js 16 route handlers" && git push');
console.log('4. Vercel will automatically redeploy');