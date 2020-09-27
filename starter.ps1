$url = "https://nodejs.org/dist/latest-v14.x/node-v14.8.0-win-x64.zip"
$version = "node-v14.8.0-win-x64"
 
if (-Not (Test-Path -Path ./.bin/node/$version/)){
    Invoke-WebRequest -Uri $url -OutFile ./.bin/$version.zip
    Expand-Archive -Path ./.bin/$version.zip -DestinationPath ./.bin/node
    Remove-Item ./.bin/$version.zip
}

Start-Process -FilePath .bin/node/$version/node.exe -ArgumentList --version -NoNewWindow -Wait
Start-Process -FilePath .bin/node/$version/node.exe -ArgumentList starter.js -NoNewWindow -Wait
pause