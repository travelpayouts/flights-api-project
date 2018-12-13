/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {has} from 'lodash';
import {argv} from 'yargs';

export default function () {
    const mode = has(argv, 'env.mode') ? argv.env.mode : 'production';
    const isProduction = mode === 'production';
    const isDev = !isProduction;
    const webpackMode = isProduction ? 'production' : 'development';
    return {
        mode,
        isProduction,
        isDev,
        webpackMode,
    };
}