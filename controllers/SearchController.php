<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:39
 */

namespace app\controllers;

use app\models\FlightsSearch;
use Yii;
use \yii\rest\Controller;
use GuzzleHttp\Client;

class SearchController extends Controller
{
    public function actionCreate()
    {
        $name = Yii::$app->request->post();
        $model = new FlightsSearch();
        $model->attributes = $name;
        if ($model->validate()) {
            return [
                'status' => 'ok',
                'data' => $model->search(),
            ];
        }

        return [
            'status' => 'error',
            'data' => $model->getErrors(),
        ];
    }

    public function actionView($id)
    {
        return FlightsSearch::instance()->getResults($id);
    }

    public function actionRedirect($searchId, $urlId)
    {
        return FlightsSearch::instance()->getRedirect($searchId, $urlId);
    }


}