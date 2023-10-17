const fs = require('fs');
const shell = require('shelljs');
const terminal = require('./terminal');

async function runShellExec (command) {
  return new Promise(resolve => {
    shell.exec(command, { async: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        terminal.error(`error while exec command: ${command}`);
      }
      resolve();
    });
  });
}

function runShellCd (path) {
  if (fs.existsSync(path)) {
    shell.cd(path);
  } else {
    terminal.error(`Folder does not exist: ${path}`);
  }
}

module.exports = {
  runShellCd,
  runShellExec,
  shell
};
