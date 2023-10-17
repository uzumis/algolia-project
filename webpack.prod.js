const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = env => {

    const writeToDisk = env && Boolean(env.writeToDisk);

    return merge(common, {
        mode: 'production',
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin(),
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: ['default', {
                            calc: true,
                            convertValues: true,
                            discardComments: {
                                removeAll: true
                            },
                            discardDuplicates: true,
                            discardEmpty: true,
                            mergeRules: true,
                            normalizeCharset: true,
                            reduceInitial: true, // This is since IE11 does not support the value Initial
                            svgo: true
                        }],
                    }
                }),
            ],
        },
        performance: {
            hints: 'warning',
            maxAssetSize: 1048576,
            maxEntrypointSize: 1048576
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './resources' }
                ]
            }),
        ],
        devServer: {
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
