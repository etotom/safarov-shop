@echo off
REM Удалить package-lock.json из Git репозитория
echo Removing package-lock.json from git...
git rm --cached package-lock.json

REM Обновить .gitignore
echo Adding files to git...
git add .gitignore package.json

REM Закоммитить
echo Committing...
git commit -m "Fix Vercel deployment - remove lock files from git, lock package versions"

REM Запушить
echo Pushing to GitHub...
git push origin main

echo Done! Vercel will now rebuild the project.
