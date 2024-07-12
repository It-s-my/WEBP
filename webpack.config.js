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
        filename: 'bundle.js', //[chunkhash] для уникального имени файла
        path: path.resolve(__dirname, '')
    }
};
