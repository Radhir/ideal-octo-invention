# 🚀 EliteShine ERP: Automated Push to GitHub

$commitMessage = Read-Host -Prompt "Enter commit message (default: 'Update EliteShine')"
if ($commitMessage -eq "") { $commitMessage = "Update EliteShine" }

Write-Host "📦 Staging changes..." -ForegroundColor Cyan
git add .

Write-Host "✍️ Committing changes..." -ForegroundColor Cyan
git commit -m "$commitMessage"

Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
# Ensure we are pushing to the correct remote/branch
git push origin main

Write-Host "✅ Done! Code is on GitHub." -ForegroundColor Green
Write-Host "Now run './deploy.sh' on your Hostinger VPS." -ForegroundColor Yellow
