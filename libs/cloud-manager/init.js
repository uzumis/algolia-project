const {runShellExec} = require("../utils/cli");

const env = (arg) => {
    runShellExec("webpack-dev-server --env dev --config ./webpack.dev.js");
    runShellExec(`node ./libs/cloud-manager/proxy.js ${arg}`);
};

env(process.argv[process.argv.length - 1]);
