const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {
    return {
        entry: './src/index.tsx',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: [/node_modules/, /src\/server/]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader' 
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                esModule: false,
                            },
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "app.css",
                allChunks: true
            })
        ],
        resolve: {
            extensions: [ '.tsx', '.ts', '.js', 'scss', '.css', '.png' ]
        },
        output: {
            filename: 'mesezene-bundle.js',
            library: 'mesezene',
            libraryTarget: 'var'    
        },
        context: __dirname,
        devtool: 'eval',
        devServer: {
            contentBase: ['.', './test', './assets', './demo'],
            port: 8764
        }
    }
};