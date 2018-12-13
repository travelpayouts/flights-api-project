/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

module.exports = {
    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    ie8: false,
                    // ecma: 6,
                    mangle: false,
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    compress: false,
                    warnings: false,
                    comments: false
                }
            })
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            sourceMap: false,
            minimize: false,
            discardComments: {
                removeAll: true
            }
        })
    ]
};
