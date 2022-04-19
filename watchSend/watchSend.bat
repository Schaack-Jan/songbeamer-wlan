@echo off
setlocal enabledelayedexpansion

goto start

:setServer
set server=127.0.0.1
set /p server=Bitte gib die Zielserver Adresse ein [%server%]:
goto execution

:checkServer
set rv=Keine Verbindung
FOR /F %%I IN ('%curl% http://%server%/check -o - -s') DO set rv=%%I
goto execution

:start
set curl=%cd%\curl\curl.exe
set env=%cd%\.env

:execution
if not defined server (
    goto setserver
)

if exist %env% (
    if exist %curl% (
            if not defined rv (
                 goto checkServer
            )

            if "%rv%" == "OK" (
                cls
                copy /y NUL songbeamer.txt >NUL
                echo Dateiaenderungen werden nun an den Server gesendet
                echo Dieses Fenster bitte *NICHT* schliessen
                powershell -file setWatch.ps1 -server "192.168.178.18"
            ) else (
                echo Der Server '%server%' ist nicht erreichbar
            )
    ) else (
        echo Curl konnte nicht gefunden werden.
    )
) else (
    copy %cd%\.env.example %cd%\.env

)

endlocal