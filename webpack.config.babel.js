/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import {StatsWriterPlugin} from 'webpack-stats-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import optionsFn from './webpack/options';
import {argv} from 'yargs';
import {sassRule, cssRule, pluginConfig as cssExtractPlugin} from './webpack/miniCssExtractPluginRules';

const options = optionsFn();

if (options.isProduction && argv.w === true) {
    console.error('\x1b[31m', `Use command 'npm run watch' to run webpack in dev mode or use 'npm run build' to create a build.`, '\x1b[0m');
    throw new Error('Runtime exception');
}

export default function () {
    let result = {
        context: path.join(__dirname, './frontend'),
        target: 'web',
        mode: options.webpackMode,
        entry: {
            'app': [
                './app.js',

            ],
            'vendor': [
                'jquery',
                'angular',
            ]
        },
        output: {
            path: path.join(__dirname, './web/assets'),
            publicPath: './',
            filename: '[name].bundle.js',
            chunkFilename: 'chunk.[contenthash].js'
        },
        module: {
            rules: [
                {
                    test: /\.s(c|a)ss$/,
                    use: sassRule,
                },
                {
                    test: /\.css$/,
                    use: cssRule
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                },
                {
                    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: 'file-loader',
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: 'url-loader?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            attrs: [':data-src']
                        }
                    }]
                },
                {
                    test: /\.svg/,
                    loader: 'svg-fill-loader?raw=tr'
                },
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    }, {
                        loader: 'expose-loader',
                        options: '$'
                    }]
                }
            ]
        },
        optimization: {
            runtimeChunk: {
                name: 'runtime'
            },
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    styles: {
                        name: 'common',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        resolve: {
            alias: {}
        },
        plugins: [
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(options.mode)
            }),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
            }),
            new StatsWriterPlugin({
                fields: ['hash', 'assetsByChunkName', 'publicPath'],
                filename: 'stats.json'
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
            cssExtractPlugin,
            new CleanWebpackPlugin([
                '*.js',
                '*.png',
                '*.svg',
                '*.ttf',
                '*.map',
                '*.css',
                '*.json',
            ], {
                // Absolute path to your webpack root folder (paths appended to this)
                // Default: root of your package
                root: path.join(__dirname, './web/assets'),
                // Write logs to console.
                verbose: options.isDev,
                // Use boolean 'true' to test/emulate delete. (will not remove files).
                // Default: false - remove files
                dry: false,
                // If true, remove files on recompile.
                // Default: false
                watch: false
            }),
        ],
    };

    if (options.isProduction) {
        result = webpackMerge(result, require('./webpack/webpack.config.prod'));
    } else if (options.isDev) {
        result = webpackMerge(result, require('./webpack/webpack.config.dev'));
    }

    return result;
};