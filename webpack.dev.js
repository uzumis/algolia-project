const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const components = require('./import-components.js');
const aem = require("./env.js");

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = env => {

    const writeToDisk = env && Boolean(env.writeToDisk);
    let proxy_aem_local_config = [];

    if (env && env.proxy === "local") {
        proxy_aem_local_config = [
            {
                context: [
                    "/content/**/*.(html|jpg|jpeg|svg|png|csv|model.json)",
                    "/etc.clientlibs/**",
                    "/libs/**"
                ],
                target: "http://localhost:4502",
                secure: false,
                changeOrigin: true,
                headers: {
                    'x-force-theme': "proxy",
                },
            },
            {
                context: [
                    "/apps/otempo/clientlibs/theme/"
                ],
                target: "http://localhost:8080",
                pathRewrite: function (path, req) {
                    return path.replaceAll("/apps/otempo/clientlibs/theme", "");
                },
            }
        ];
    };


    return merge(common, {
        mode: 'development',
        performance: {
            hints: 'warning',
            maxAssetSize: 1048576,
            maxEntrypointSize: 1048576
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: "./clientlib-site/" }
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html')
            })
        ].concat(components.register.map(cmp => {
            return new HtmlWebpackPlugin({
                filename: `${cmp}.html`,
                template: path.resolve(__dirname, SOURCE_ROOT + `/components/${cmp}/` + `${cmp}.html`),
            })
        })),
        devServer: {
            port: 8080,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            proxy: [
                {
                    context: ["/images/", "/fonts/"],
                    target: "http://localhost:8080",
                    pathRewrite: function (path, req) {
                        return "/clientlib-site".concat(path);
                    },
                },
                
            ].concat(proxy_aem_local_config),
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
            watchFiles: ['src/**/*'],
            hot: true,
            devMiddleware: {
                writeToDisk: writeToDisk
            }
        }
    });
}
