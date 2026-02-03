const fs = require('fs');
const path = require('path');

const routeFile = 'app/api/addresses/[id]/route.ts';

try {
  const fullPath = path.join(__dirname, routeFile);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  content = content.replace(
    /(\{ params \}: \{ params: \{ ([^:]+): string \} \})/g,
    '{ params }: { params: Promise<{ $2: string }> }'
  );
  
  console.log('File updated. Please manually check the following:');
  console.log('1. Make sure params is awaited: const { id } = await params;');
  console.log('2. Use "id" instead of "params.id"');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated: ${routeFile}`);
} catch (error) {
  console.log(`Error: ${error.message}`);
}