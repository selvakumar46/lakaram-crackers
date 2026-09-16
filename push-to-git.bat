@echo off
echo =======================================================
echo Push Lakaram Crackers Code to GitHub
echo =======================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/selvakumar46/Crackers.git): "
if "%REPO_URL%"=="" (
    echo Repository URL cannot be empty!
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
echo.
echo Pushing main branch to %REPO_URL%...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo =======================================================
    echo Code successfully pushed to GitHub!
    echo =======================================================
) else (
    echo.
    echo If authentication failed, please log in with your GitHub Personal Access Token or GitHub Desktop.
)
pause
