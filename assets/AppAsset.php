<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use app\components\WebpackAssetBundle;

class AppAsset extends WebpackAssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $assetsUrl = '@web/assets';
    public $statsPath = '@webroot/assets/stats.json';

    public $js = [
        '/assets/runtime.bundle.js'
    ];

    public $chunks = [
        'vendor',
        'app',
    ];
}