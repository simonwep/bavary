const {version} = require('./package');
const webpack = require('webpack');

module.exports = {
    mode: 'production',

    entry: {
        'bavary.min.js': './src/index.ts'
    },

    output: {
        publicPath: 'dist',
        filename: '[name]',
        library: 'Bavary',
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: [
                    'ts-loader',
                    'eslint-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: `Bavary ${version} MIT | https://github.com/Simonwep/bavary`
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].map'
        })
    ]
};
