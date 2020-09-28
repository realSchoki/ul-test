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