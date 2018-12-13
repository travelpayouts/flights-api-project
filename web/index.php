<?php
$composerAutoloadPath = __DIR__ . '/../vendor/autoload.php';
if (file_exists($composerAutoloadPath)) {
    // comment out the following two lines when deployed to production
    defined('YII_DEBUG') or define('YII_DEBUG', true);
    defined('YII_ENV') or define('YII_ENV', 'dev');

    require(__DIR__ . '/../vendor/autoload.php');
    require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

    $config = require(__DIR__ . '/../config/web.php');

    (new yii\web\Application($config))->run();
} else {
    $templatePathData = [
        __DIR__,
        DIRECTORY_SEPARATOR,
        'templates',
        DIRECTORY_SEPARATOR,
        'installationMessage.html'
    ];
    $templatePath = implode('', $templatePathData);
    if ($templatePath) {
        $template = file_get_contents($templatePath);
        echo($template);
    }
}
