@echo off
(echo. && echo.)
echo                                   VIT
echo --------------------------------------------------------------------------
echo        "Potato : Trying to start application preview in Chrome..."
(echo.)
echo           "Potato : Starting Application Server using nodemon"
echo --------------------------------------------------------------------------
(echo. && echo.)
start chrome.exe http://localhost:4400
nodemon
@echo on