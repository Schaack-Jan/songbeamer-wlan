@echo off

set curl=%cd%\curl\curl.exe
set watchexec=%cd%\watchexec.exe
set server=%1

echo %1
%curl% -X POST -F "songbeamer=@%cd%\songbeamer.txt" http://%server%/send

