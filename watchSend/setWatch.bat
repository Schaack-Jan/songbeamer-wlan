@echo off
setlocal

set curl=%cd%\curl\curl.exe
set watchexec=%cd%\watchexec.exe
set server=%1

rem %curl% -X POST -F "songbeamer=@%cd%\songbeamer.txt" http://%server%/send
%curl% -X POST -F "songbeamer=@%cd%\songbeamer.txt" http://127.0.0.1/send

endlocal