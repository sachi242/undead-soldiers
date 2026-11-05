@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install the LTS version from https://nodejs.org/
  echo Then double-click this launcher again.
  pause
  exit /b 1
)
node launch-game.cjs
if errorlevel 1 pause
endlocal
