const colors = require('colors/safe');
const shell = require('shelljs');
const path = require('path');

// set color theme
colors.setTheme({
  info: 'yellow',
  success: 'green',
  error: ['red', 'bold']
});

const packageName = require(path.join(process.cwd(),"package.json")).cli;

const error = function (message, exit = true) {
  shell.echo(colors.error(`[${packageName}]: ERROR! ${message}`));

  if (exit) {
    shell.echo(colors.error(`[${packageName}]: check logs for errors`));
    process.exit(1);
  }
};

const info = function (message) {
  shell.echo(colors.info(`[${packageName}]:`), message);
};

const success = function (message) {
  shell.echo(colors.success(`[${packageName}]:`), message);
};

module.exports = {
  error, info, success
};
