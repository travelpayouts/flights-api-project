<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use GuzzleHttp\Client;
use yii\web\ErrorAction;

class SiteController extends Controller
{

    /**
     * @inheritdoc
     */
    public function actions(): array
	{
        return [
            'error' => [
                'class' => ErrorAction::class,
            ]
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex(): string
	{
        return $this->render('index');
    }
}
