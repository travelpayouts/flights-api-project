/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

import path from 'path';
import optionsFn from './options';

const options = optionsFn();
export default [
    {
        loader: 'css-loader',
        options: {
            sourceMap: options.isProduction,
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.isProduction,
            plugins: (() => {
                return options.isProduction ? [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    }),
                    require('cssnano')({
                        discardComments: {
                            removeAll: true
                        }
                    })
                ] : [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    }),
                ]
            })(),
        },
    },
    {
        loader: 'resolve-url-loader',
        options: {
            keepQuery: true,
            debug: options.isDev,
            root: path.resolve(__dirname, '../frontend'),
        },
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true,
        }
    },
    {
        loader: 'sass-resources-loader',
        options: {
            resources: [
                path.resolve(__dirname, '../frontend/scss/utils/_variables.scss'),
            ]
        }
    }

]