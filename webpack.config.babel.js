
import path from 'path';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin';

export default function(env, argv) {
    return {
        context: path.resolve(__dirname, 'src/app'),
        entry: './index.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, './public/dist')
        },
        resolve: {
            extensions: ['.js', '.css', '.html']
        },
        devtool: env.production ? 'source-maps' : 'eval',
        module: {
            rules: [
                {
                    test: /\.html?$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.css?$/,
                    loader: ['style-loader', 'css-loader']
                },
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['env']
                            }
                        }, {
                            loader: 'eslint-loader'
                        }
                    ]
                },
                {
                    test: require.resolve('jquery'),
                    use: [
                        {
                            loader: 'expose-loader',
                            options: '$'
                        }
                    ]
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=1000' }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                underscore: 'underscore'
            }),
            new ngAnnotatePlugin({
                add: true,
                // other ng-annotate options here
            })
        ]
    }
};

