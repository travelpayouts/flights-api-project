<?php

use yii\i18n\PhpMessageSource;
use yii\rest\UrlRule;
use yii\log\FileTarget;
use yii\web\JsonParser;
use yii\caching\FileCache;
use app\components\TravelPayoutsApi;
use yii\helpers\ArrayHelper;

$params = require(__DIR__ . '/params.php');

return ArrayHelper::merge([
	'id' => 'flight-api-project',
	// set target language
	'language' => 'en-US',
	// set source language
	'sourceLanguage' => 'en-US',
	'basePath' => dirname(__DIR__),
	'bootstrap' => ['log'],

	'components' => [
		'assetManager' => [
			'bundles' => [
			],
		],
		'request' => [
			'baseUrl' => $params['baseUrl'],
			// !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
			'cookieValidationKey' => 'Dup2x1YhKSYBPDCpbulnNCPoMaOAyHxf',
			'parsers' => [
				'application/json' => JsonParser::class, // required for POST input via `php://input`
			],
		],
		'cache' => [
			'class' => FileCache::class,
		],
		'user' => [
			'identityClass' => 'app\models\User',
			'enableAutoLogin' => true,
		],
		'errorHandler' => [
			'errorAction' => 'site/error',
		],
		'log' => [
			'traceLevel' => YII_DEBUG ? 3 : 0,
			'targets' => [
				[
					'class' => FileTarget::class,
					'levels' => ['error', 'warning'],
				],
			],
		],
		'defaultRoute' => 'site',
		'urlManager' => [
			'enablePrettyUrl' => true,
			'showScriptName' => false,
			'rules' => [
				['class' => UrlRule::class, 'controller' => 'search', 'pluralize' => false, 'prefix' => 'api'],
				'POST api/search/redirect/<searchId:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}>/<urlId:.\d+>' => 'search/redirect',
				'redirect/<searchId:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}>/<urlId:.\d+>' => 'site/index',
				'api/search/<id:.*?>' => 'search/view',
				'<action:\w+>' => 'site/index',
			],
		],
		'i18n' => [
			'translations' => [
				'main*' => [
					'class' => PhpMessageSource::class,
					'fileMap' => [
						'main' => 'main.php',
					],
				],
			],
		],
		'travelpayoutsApi' => [
			'class' => TravelPayoutsApi::class,
			'host'=> $_SERVER['HTTP_HOST'],
			'token' => $params['params']['apiToken'] ?? null,
			'marker' => $params['params']['apiMarker'] ?? null,
			'locale' => $params['params']['apiResponseLang'],
		],
	],
], $params);
