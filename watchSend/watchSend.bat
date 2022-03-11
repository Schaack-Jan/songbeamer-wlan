@echo off

set "curl="
set "watchexec="
set "server="
set "r="

set curl=%cd%\curl\curl.exe
set watchexec=%cd%\watchexec.exe

if exist %curl% (
	if exist %watchexec% (
		set /p server=Bitte die Server Adresse eingeben [127.0.0.1]:
		FOR /F %%I IN ('%curl% http://%server%/check -o - -s') DO set rv=%%I
		
		if "%rv%" == "OK" (
			copy /y NUL songbeamer.txt >NUL
			%watchexec% -w songbeamer.txt %cd%\setWatch.bat %server%
		) else (
			echo Der Server "%server%" ist nicht erreichbar
		)
	) else (
		echo watchexec konnte nicht gefunden werden.
	)
) else (
	echo Curl konnte nicht gefunden werden.
)

set "curl="
set "watchexec="
set "server="
set "r="