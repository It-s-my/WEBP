const path = require('path');

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
        ]
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '')
    }

};
