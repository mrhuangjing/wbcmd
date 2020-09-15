const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const CONFIG = {
    mode: 'development',
    entry: {},
    output: {
        publicPath: '/',
        path: path.resolve('./', 'dist'),
        filename: 'js/[name].[hash].js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css'
        })
    ],
    module: {
        rules: [
            {
                // test: /\.js$/,
                // use: {
                //     loader: 'babel-loader'
                // },
                // exclude: '/node_modules/'
                test: /.js$/,
                exclude: /node_modules/,
                // use: 'babel-loader'
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env", {
                                    modules: false,
                                    corejs: "3",
                                    useBuiltIns: "usage"
                                }
                            ]
                        ],
                    }
                }
            }, 
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    // 'postcss-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({Browserslist: ['ie>=8','>1% in CN']})
                            ]
                        }
                    },
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // Provide path to the file with resources
                            resources: './src/css/common.scss',
                
                            // Or array of paths
                            //   resources: ['./path/to/vars.scss', './path/to/mixins.scss']
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(jpg|png|gif|webp)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            fallback: 'file-loader',
                            limit: 8192,
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                            name: 'fonts/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
        extensions: [ '.tsx', '.ts', '.js', '.vue' ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, 'node_modules')]
    }
};

module.exports = CONFIG;