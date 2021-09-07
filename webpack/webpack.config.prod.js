/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

import {LoaderOptionsPlugin} from 'webpack';
import TerserJSPlugin from 'terser-webpack-plugin';

module.exports = {
    optimization: {
        minimizer: [
            new TerserJSPlugin({
                parallel: true,
                terserOptions: {
                    mangle: false,
                },
            }),
        ],
    },
    plugins: [
        new LoaderOptionsPlugin({
            sourceMap: false,
            minimize: false,
            discardComments: {
                removeAll: true,
            },
        }),
    ],
};
