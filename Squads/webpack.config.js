const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true,
                },
                mangle: true,
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