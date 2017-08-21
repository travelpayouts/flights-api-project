<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:39
 */

namespace app\controllers;

use app\models\Search;
use Yii;
use \yii\rest\Controller;
use thewulf7\travelPayouts\Travel;
use GuzzleHttp\Client;

class SearchController extends Controller
{
    public function actionCreate()
    {
        $result = array(
            'status' => 'ok'
        );
        $name = Yii::$app->request->post();

        $model = new Search();
        $model->attributes = $name;
        if ($model->validate()) {
            $result['data'] = $model->search();
        } else {
            $result['status'] = 'error';
            $result['data'] = $model->getErrors();

        }
        return $result;
    }


    public function actionView($id)
    {
        $api = new Travel(Yii::$app->params['apiToken']);
        $flightService = $api->getFlightService();
        $searchResults = $flightService->getSearchResults($id, false);
        echo($searchResults);
    }

    public function actionRedirect($searchId, $urlId)
    {
        $client = new Client();
        $response = $client->request('GET', "http://api.travelpayouts.com/v1/flight_searches/{$searchId}/clicks/{$urlId}.json");
        $responseBody = json_decode((string)$response->getBody(), true);
        return $responseBody;
    }


}