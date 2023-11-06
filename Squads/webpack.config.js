const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/entry.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                mangle: true,
                output: {
                    comments: false,
                },
            },
        
        })],
    },
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'public'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
};