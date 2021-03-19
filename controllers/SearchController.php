<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:39
 */

namespace app\controllers;

use app\models\FlightsSearch;
use GuzzleHttp\Exception\GuzzleException;
use Yii;
use yii\rest\Controller;
use GuzzleHttp\Client;

class SearchController extends Controller
{
    public function actionCreate(): array
    {
        $requestParams = Yii::$app->request->post();
        $model = new FlightsSearch();
        $model->attributes = $requestParams;
        if ($model->validate()) {
            $query = $model->toArray();

            try {
                return [
                    'status' => 'ok',
                    'data' => Yii::$app->travelpayoutsApi->searchFlightsTickets(
                        $query
                    ),
                ];
            } catch (GuzzleException $e) {
                return [
                    'status' => 'error',
                    'data' => ['exception' => $e->getMessage()],
                ];
            }
        }

        return [
            'status' => 'error',
            'data' => $model->getErrors(),
        ];
    }

    public function actionView($id): array
    {
        return Yii::$app->travelpayoutsApi->getResultsById($id);
    }

    public function actionRedirect($searchId, $urlId): array
    {
        return Yii::$app->travelpayoutsApi->getRedirectUrl($searchId, $urlId);
    }
}
