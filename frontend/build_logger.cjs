const { exec } = require('child_process');
const fs = require('fs');

const logFile = 'build_log_captured.txt';
const command = 'npm run build';

console.log(`Running ${command}...`);
exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n\nERROR:\n${error ? error.message : 'None'}`;
    fs.writeFileSync(logFile, output);
    console.log(`Build finished. Output saved to ${logFile}`);
});
