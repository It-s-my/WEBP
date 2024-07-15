const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js','.css']
    },
    entry: './static/index.ts',
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
    output: {
        path: path.resolve(__dirname, 'static/public'),
        filename: 'bundle.js'
    }
};
