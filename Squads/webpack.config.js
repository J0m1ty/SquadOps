const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/game/entry.ts',
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
                format: {
                    comments: false,
                },
                mangle: true,
            },
            extractComments: false
        })],
        splitChunks: {
            cacheGroups: {
                matterVendor: {
                    test: /[\\/]node_modules[\\/]matter-js[\\/]/,
                    name: 'matter',
                    chunks: 'all',
                },
                pixiVendor: {
                    test: /[\\/]node_modules[\\/]@pixi[\\/]/,
                    name: 'pixi',
                    chunks: 'all',
                },
                miscVendor: {
                    test: module => {
                        // Check if the module is in node_modules and not part of matter-js or pixi.js
                        return module.context && module.context.includes('node_modules') &&
                               !module.context.includes('matter-js') &&
                               !module.context.includes('@pixi');
                    },
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    output: {
        filename: '[name].bundle.js', // Main bundle file
        path: resolve(__dirname, 'public'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
};