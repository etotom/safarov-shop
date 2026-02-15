#!/bin/bash

# Скрипт для исправления Vercel деплоя

cd "$(dirname "$0")"

echo "🔄 Removing package-lock.json from git..."
git rm --cached package-lock.json 2>/dev/null || echo "✓ Already removed or doesn't exist in git"

echo "📝 Adding .gitignore and package.json..."
git add .gitignore package.json

echo "💾 Committing changes..."
git commit -m "Fix Vercel deployment - remove lock file from git, use exact versions"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will automatically rebuild the project."
echo "Check the build log at: https://vercel.com/dashboard"
