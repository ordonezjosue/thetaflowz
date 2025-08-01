@echo off
echo 🚀 Starting ThetaFlowz Options Platform Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo 🔨 Building the project...
call npm run build

REM Check if build was successful
if not exist "build" (
    echo ❌ Error: Build failed. Please check for errors.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to GitHub Pages
echo 🌐 Deploying to GitHub Pages...
call npm run deploy

echo 🎉 Deployment completed!
echo 📱 Your site should be available at: https://yourusername.github.io/thetaflowz
echo 🔗 To configure custom domain, follow the instructions in DEPLOYMENT.md
pause 