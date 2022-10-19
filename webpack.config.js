const path = require('path');
const webpack = require('webpack');
var copyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = '../dist';

module.exports = (env) => {
    return [{
        entry: './src/main.js',
        output: {
            filename: 'onekey-hca-sdk.js',
            path: path.resolve(bundleOutputDir),
            library: 'hcaSdk',
            library: {
                name: 'hcaSdk',
                type: 'umd',
            },
        },
        devServer: {
            contentBase: bundleOutputDir
        },
        mode: "production"
    }];
};
