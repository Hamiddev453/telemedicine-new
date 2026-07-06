@echo off
REM Bypass npm spawn issue by calling nodemon directly
node_modules\.bin\nodemon.cmd app.js
