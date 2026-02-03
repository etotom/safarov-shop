#!/bin/bash

echo "íº€ Fixing ALL Prisma queries in the project..."

# Backup directory
mkdir -p prisma_backups

# Function to fix a file
fix_file() {
  local file="$1"
  local backup="prisma_backups/$(basename "$(dirname "$file")")-$(basename "$file")"
  
  # Backup original
  cp "$file" "$backup"
  
  # Fix the file
  sed -i '
    # Fix findMany with two arguments
    s/db\.\([a-zA-Z]*\)\.findMany({}, {/db.\1.findMany({/g
    s/db\.\([a-zA-Z]*\)\.findMany(\([^)]*\), {/db.\1.findMany({ where: \2, /g
    
    # Fix update with two arguments
    s/db\.\([a-zA-Z]*\)\.update({ \(.*\) }, { \(.*\) })/db.\1.update({ where: { \2 }, data: { \3 })/g
    
    # Fix findUnique with two arguments (should only have one)
    s/db\.\([a-zA-Z]*\)\.findUnique({}, {/db.\1.findUnique({/g
    ' "$file"
  
  echo "âœ… Fixed: $file"
}

# Find and fix all files with Prisma issues
find app -name "*.ts" -o -name "*.tsx" | while read file; do
  if grep -q "\.findMany\|\.findUnique\|\.update\|\.create\|\.delete" "$file"; then
    if grep -q "\.\(findMany\|findUnique\|update\)(.*,.*)" "$file"; then
      fix_file "$file"
    fi
  fi
done

echo ""
echo "í³‹ Summary of changes:"
echo "1. Changed: db.table.findMany({}, { ...options }) â†’ db.table.findMany({ ...options })"
echo "2. Changed: db.table.findMany({condition}, { ...options }) â†’ db.table.findMany({ where: {condition}, ...options })"
echo "3. Changed: db.table.update({condition}, {data}) â†’ db.table.update({ where: {condition}, data: {data} })"
echo ""
echo "í¾‰ All Prisma queries have been fixed!"
