const {version} = require('./package');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package');
const path = require('path');

const base = {
    mode: 'production',

    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'ts-loader',
                    'eslint-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    }
};

module.exports = [
    {
        ...base,
        entry: {
            'bavary.js': './src/core/index.ts'
        },

        output: {
            filename: '[name]',
            path: `${__dirname}/lib`,
            library: 'Bavary',
            libraryTarget: 'umd',

            // See https://github.com/webpack/webpack/issues/6525
            globalObject: `(() => {
                if (typeof self !== 'undefined') {
                    return self;
                } else if (typeof window !== 'undefined') {
                    return window;
                } else if (typeof global !== 'undefined') {
                    return global;
                } else {
                    return Function('return this')();
                }
            })()`
        },

        plugins: [
            new webpack.BannerPlugin({
                banner: `Bavary ${version} MIT | https://github.com/Simonwep/bavary`
            }),

            new webpack.SourceMapDevToolPlugin({
                filename: '[name].map'
            }),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version)
            })
        ],

        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    sourceMap: true
                })
            ]
        }
    },

    {
        ...base,
        target: 'node',

        entry: {
            'cli.js': './src/cli/index.ts'
        },

        output: {
            filename: '[name]',
            path: `${__dirname}/lib`
        },

        externals: {
            glob: 'require("glob")',
            chalk: 'require("chalk")',
            chokidar: 'require("chokidar")',
            commander: 'require("commander")'
        },

        plugins: [
            new webpack.BannerPlugin({
                banner: `Bavary CLI ${version} MIT | https://github.com/Simonwep/bavary`
            }),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version)
            })
        ],

        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    sourceMap: false,
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true,
                        mangle: false,
                        compress: false,
                        output: {
                            beautify: true
                        }
                    }
                })
            ]
        }
    }
];
