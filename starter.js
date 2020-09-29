'use strict';

const fs = require('fs');
const mustache = require('mustache');

var isWin = process.platform === "win32";
var isLin = process.platform === "linux";
var isMac = process.platform === "darwin";

const env_to_var = {
    UL_HOST : 'host',
    UL_NAME : 'name',
    UL_PORT : 'port',
    UL_PLAYER : 'player',
    UL_PASSWORD : 'password',
    UL_TOKEN : 'token',
    UL_ANNOUNCE : 'announce',
    UL_GAMEMODE : 'gamemode',
    UL_LANGUAGE : 'language',
    UL_DESCRIPTION : 'description',
    UL_DEBUG : 'debug',
    UL_WEBSITE : 'website',
    UL_STREAMINGDISTANCE : 'streamingDistance',
    UL_MIGRATIONDISTANCE : 'migrationDistance',
    //UL_VOICE : 'voice',
    UL_TAGS : 'tags',
    UL_USEEARLYAUTH : 'useEarlyAuth',
    UL_EARLYAUTHURL : 'earlyAuthUrl',
    UL_USECDN : 'useCdn',
    UL_CDNURL : 'cdnUrl',
}



var getResources = (env) => {
    if(env === "gd"){
        let rawdata_code = fs.readFileSync(`config/code.cfg`);
        let rawdata_map = fs.readFileSync(`config/map.cfg`);
        let config_code = JSON.parse(rawdata_code);
        let config_map = JSON.parse(rawdata_map);
        let resources = [...config_code.resources, ...config_map.resources].reduce((acc, val) => {
            if(acc.includes(val)) { 
                return acc
            } else {
                return [...acc, val]
            }
        },[])
        console.log('Loading following resources: ')
        console.log(resources);
        return resources.map( val => ({'name': val}))
    } else {
        let rawdata = fs.readFileSync(`config/${env}.cfg`);
        let config = JSON.parse(rawdata);
        console.log('Loading following resources: ')
        console.log(config.resources);
        return config.resources.map( val => ({'name': val}))
    }
}

console.log("Generate Config...")

if ( !process.env.UL_ENV ) {
    console.log("Loading default config ... ")
    process.env.UL_ENV = 'local'
}

const default_settings = {
    name: "Local UL-Test Server",
    host: '127.0.0.1',
    port: 7788,
    players: 128,
    website: 'example.com',
    description: 'Local UL-Test Server',
    resources: getResources(process.env.UL_ENV),
    announce: false,
    gamemode: 'Freeroam',
    website: 'example.com',
    language: 'de',
    debug: false,
    migrationDistance: 150,
    //voice: {},
    tags: [],
    useEarlyAuth: false,
    useCdn: false,
}


var settings = default_settings
Object.entries(process.env).filter( item => item[0].startsWith('UL_')).forEach( item => {
    if(item[0] === "UL_TAGS"){
        settings[env_to_var[item[0]]] = item[1].split(',').map( val => ({name: val}))
    } else if (env_to_var[item[0]]) { 
        settings[env_to_var[item[0]]] = item[1]
    }
})

let rawdata = fs.readFileSync(`templates/server.cfg.mustache`);
var output = mustache.render(rawdata.toString(), settings);

console.log("Starting server...")

const { spawn } = require('child_process');
var child
if (isWin) {
    child = spawn('altv-server.exe', [], {shell: true, stdio: 'inherit'});

} else if (isLin || isMac) {
    child = spawn('bash', ['./start.sh'], { shell: true, stdio: 'inherit' });
    process.on("SIGINT", function () {
        process.kill(child.pid, 'SIGINT');
    });
} else {
    console.log("ERROR, NO BINARY")
    exit
}
process.on("SIGINT", function () {
    //graceful shutdown
    process.kill(child.pid, 'SIGINT');
});

child.on('exit', function (code, signal) {
    console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
});