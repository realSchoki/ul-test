var isWin = process.platform === "win32";
var isLin = process.platform === "linux";
var isMac = process.platform === "darwin";

function generateConfig(instance) {
    if (instance in ["scripting", "mapping", "production"]) {

    } else if (instance === "testing") {

    } else {
        console.log("ERROR, UNKNOWN INSTANCE")
    }
}

console.log("Starting server...")

const { spawn } = require('child_process');
var child
if (isWin) {
    //child = spawnSync(".\\altv-server.exe", [], {cwd: "./", stdio: "pipe", shell: true})
    //child = require('child_process').spawn('altv-server.exe');
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        //process.emit("SIGINT");
        process.kill(child.pid, 'SIGINT');
    });
} else if (isLin || isMac) {
    child = spawn('bash', ['./start.sh'], { shell: true, stdio: 'inherit' });
    process.on("SIGINT", function () {
        //graceful shutdown
        process.kill(child.pid, 'SIGINT');
    });
} else {
    console.log("ERROR, NO BINARY")
    exit
}

child.on('exit', function (code, signal) {
    console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
});
/*
child.stdout.on('data', (data) => {
    a = String(data)
});

child.stderr.on('data', (data) => {
    console.error(`b${data}`);
});
*/