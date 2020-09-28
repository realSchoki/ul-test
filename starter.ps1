$version = "node-v14.12.0-win-x64"
$url = "https://nodejs.org/dist/latest-v14.x/$version.zip"
 
if (-Not (Test-Path -Path ./.bin/node/$version/)){
    Invoke-WebRequest -Uri $url -OutFile ./.bin/$version.zip
    Expand-Archive -Path ./.bin/$version.zip -DestinationPath ./.bin/node
    Remove-Item ./.bin/$version.zip
}

Start-Process -FilePath .bin/node/$version/node.exe -ArgumentList --version -NoNewWindow -Wait
$node = 0
try {
    $node = (Start-Process -FilePath .bin/node/$version/node.exe -ArgumentList starter.js -NoNewWindow -PassThru).Id
    Wait-Process $node
} finally {
    sleep 3
    Wait-Process $node
    Read-Host -Prompt "Exiting ... Confirm"
}