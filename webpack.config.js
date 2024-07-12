const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
            },
        ],
    },
    plugins: [
        new WebpackObfuscator({
            rotateStringArray: true,
            stringArrayEncoding: ['base64'], // Указываем значение как массив
            stringArrayThreshold: 0.75
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '')
    }
};
