const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '.css']
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
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './static/index.html',
            filename: '../index2.html', // Указываем путь для сохранения HTML файла
            // publicPath: '', // Оставляем publicPath пустым
            // inject: true,
            // scriptLoading:"module"

        })
    ],
    output: {
        path: path.resolve(__dirname, 'static/public'),
        filename: 'bundle.[contenthash].js'
    }
};
