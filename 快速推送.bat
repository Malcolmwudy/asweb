@echo off
chcp 65001 >nul
echo ========================================
echo 推送渠道过滤功能到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo 检查 Git 状态...
git status --short
echo.

set /p confirm=是否继续提交并推送到 GitHub? (Y/N): 
if /i not "%confirm%"=="Y" (
    echo 已取消操作。
    exit /b 0
)

echo.
echo 添加修改的文件...
git add lib/api/content.ts app/contact/page.tsx

if errorlevel 1 (
    echo 错误：添加文件失败！
    pause
    exit /b 1
)

echo ✓ 文件已添加
echo.

echo 提交更改...
git commit -m "添加 support_teams 和 more_tips 的渠道过滤功能"

if errorlevel 1 (
    echo 错误：提交失败！
    pause
    exit /b 1
)

echo ✓ 更改已提交
echo.

echo 推送到 GitHub...
git push origin main

if errorlevel 1 (
    echo 错误：推送失败！
    echo 请检查网络连接和 GitHub 认证。
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ 推送成功！
echo ========================================
echo.
echo 查看仓库：
echo https://github.com/Malcolmwudy/asweb
echo.
pause

