/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import sassLoaders from './sassLoaders';

export const sassRule = [{loader: MiniCssExtractPlugin.loader}].concat(sassLoaders);

export const cssRule = [
    MiniCssExtractPlugin.loader,
    'css-loader'
];
export const pluginConfig = new MiniCssExtractPlugin({filename: '[contenthash].styles.css',});