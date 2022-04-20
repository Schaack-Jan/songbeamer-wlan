param([String]$server="127.0.0.1")
# make sure you adjust this to point to the folder you want to monitor
$PathToMonitor = (Get-Item .).FullName
$global:songbeamer = (Get-Item songbeamer.txt).FullName
$global:server = $server

$FileSystemWatcher = New-Object System.IO.FileSystemWatcher
$FileSystemWatcher.Path  = $PathToMonitor
$FileSystemWatcher.Filter = "songbeamer.txt"
$FileSystemWatcher.IncludeSubdirectories = $false

# make sure the watcher emits events
$FileSystemWatcher.EnableRaisingEvents = $true

# define the code that should execute when a file change is detected
$Action = {
    $curl = (Get-Item curl\curl.exe).FullName
    $argList = @('-X POST', '-s', "-F songbeamer=@$global:songbeamer" , "http://$global:server/send")
    $details = $event.SourceEventArgs
    $Name = $details.Name
    $FullPath = $details.FullPath
    $OldFullPath = $details.OldFullPath
    $OldName = $details.OldName
    $ChangeType = $details.ChangeType
    $Timestamp = $event.TimeGenerated
    $text = "{0} was {1} at {2}" -f $FullPath, $ChangeType, $Timestamp
    Write-Host $text -ForegroundColor Green

    # you can also execute code based on change type here
    switch ($ChangeType)
    {
        'Changed' {
            Start-Process $curl -ArgumentList $argList -NoNewWindow -RedirectStandardOutput ".\NUL"
        }
        'Created' { #"CREATED"
            Start-Process $curl -ArgumentList $argList -NoNewWindow -RedirectStandardOutput ".\NUL"
        }
        default { Write-Host $_ -ForegroundColor Red -BackgroundColor White }
    }
}

# add event handlers
$handlers = . {
    Register-ObjectEvent -InputObject $FileSystemWatcher -EventName Changed -Action $Action -SourceIdentifier FSChange
    Register-ObjectEvent -InputObject $FileSystemWatcher -EventName Created -Action $Action -SourceIdentifier FSCreate
}

#Write-Host "Schaue nach Dateiänderungen bei $PathToMonitor\songbeamber.txt"

try
{
    do
    {
        Wait-Event -Timeout 1
        Write-Host "." -NoNewline

    } while ($true)
}
finally
{
    # this gets executed when user presses CTRL+C
    # remove the event handlers
    Unregister-Event -SourceIdentifier FSChange
    Unregister-Event -SourceIdentifier FSCreate
    # remove background jobs
    $handlers | Remove-Job
    # remove filesystemwatcher
    $FileSystemWatcher.EnableRaisingEvents = $false
    $FileSystemWatcher.Dispose()
    "Event Handler disabled."
}