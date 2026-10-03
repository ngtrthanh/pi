@echo off
setlocal
"%~dp0pi.exe" --extension "%~dp0examples\extensions\risk-pdca\index.ts" --extension "%~dp0examples\extensions\jev-router.ts" --model jev/auto %*
