<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:44
 */

namespace app\models;

use Yii;
use yii\base\Model;
use app\components\TravelPayoutsApi;

/**
 * Class FlightsSearch
 * @package app\models
 * @property $marker
 * @property $token
 * @property $responseLang
 * @property $tripClass
 */
class FlightsSearch extends Model
{
    public $origin;
    public $destination;
    public $adults;
    public $children;
    public $infants;
    public $trip_class;
    public $depart_date;
    public $return_date;
    public $lang;


    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            [[
                'origin',
                'destination',
                'adults',
                'trip_class',
                'depart_date',
                'lang'
            ], 'required'],
            [
                [
                    'adults',
                    'children',
                    'infants',
                ]
                , 'integer', 'integerOnly' => true, 'min' => 0, 'max' => 9
            ],

            ['trip_class', 'integer', 'integerOnly' => true, 'min' => 0, 'max' => 1],
            [
                [
                    'depart_date',
                    'return_date'
                ]
                , 'date', 'format' => 'php:Y-m-d'
            ],
            [
                [
                    'depart_date',
                    'return_date'
                ],
                'dateValidator'
            ],
            ['infants', 'infantsValidator']
        ];
    }

    /**
     * Validate date
     * @param $attribute_name
     * @return bool
     * @throws \Exception
     */
    public function dateValidator($attribute_name)
    {
        $attributeData = strtotime($this->$attribute_name);
        if ($attribute_name === 'depart_date') {
            $today = new \DateTime();
            $today->setTime(0, 0);
            if ($today->getTimestamp() > $attributeData) {
                $this->addError($attribute_name, Yii::t('main', 'Depart date must be in future'));
                return false;
            }
        }
        if ($attribute_name === 'return_date') {
            if ($attributeData < strtotime($this->depart_date)) {
                $this->addError($attribute_name, Yii::t('main', 'Return date must be more than depart date'));
                return false;
            }
        }
        if ($attributeData > strtotime('+ 1 year')) {
            $this->addError($attribute_name, Yii::t('main', '{attribute} can not exceed a year from the current date', array(
                'attribute' => $this->getAttributeLabel($attribute_name)
            )));

        }
        return true;
    }

    /**
     * Validate count of Infants
     * @param $attribute_name
     * @return bool
     */
    public function infantsValidator($attribute_name)
    {
        $attributeData = (int)$this->$attribute_name;
        $adultCildrenData = array(
            'adults' => $this->adults,
            'children' => $this->children,
        );
        $adultCildrenDataSum = array_sum($adultCildrenData);

        if ($attributeData > $adultCildrenDataSum) {
            $this->addError($attribute_name, Yii::t('main', 'Infants can not exceed sum of adults and children'));
            return false;
        }
        return true;
    }

    /**
     * @return array customized attribute labels
     */
    public function attributeLabels()
    {
        return [
            'origin' => \Yii::t('main', 'Origin'),
            'destination' => \Yii::t('main', 'Destination'),
            'adults' => \Yii::t('main', 'Adults'),
            'children' => \Yii::t('main', 'Childen'),
            'infants' => \Yii::t('main', 'Indfants'),
            'trip_class' => \Yii::t('main', 'Trip class'),
            'depart_date' => \Yii::t('main', 'Depart date'),
            'return_date' => \Yii::t('main', 'Return date'),
            'lang' => \Yii::t('main', 'Language'),
        ];
    }

    public function getTripClass()
    {
        return (int)$this->trip_class === 0 ? 'Y' : 'C';
    }


    public function search()
    {
        $api = new TravelPayoutsApi($this->token);

        $api->setHost($_SERVER['HTTP_HOST'])
            ->setMarker($this->marker)
            ->addPassenger('adults', $this->adults)
            ->addSegment($this->origin, $this->destination, $this->depart_date);

        // Two way tickets
        if ($this->return_date)
            $api->addSegment($this->destination, $this->origin, $this->return_date);
        // Add childrens
        if ($this->children)
            $api->addPassenger('children', $this->children);
        // Add infants
        if ($this->infants)
            $api->addPassenger('infants', $this->infants);

        return $api->getSearch($this->getResponseLang(), $this->tripClass);
    }

    public function getResults($id)
    {
        $api = new TravelPayoutsApi($this->token);
        return $api->getSearchResults($id);
    }

    public function getRedirect($searchId, $urlId)
    {
        $api = new TravelPayoutsApi($this->token);
        return $api->getRedirectUrl($searchId, $urlId);
    }

    public function getMarker()
    {
        return isset (Yii::$app->params['apiMarker']) ? Yii::$app->params['apiMarker'] : null;
    }

    public function getToken()
    {
        return isset(Yii::$app->params['apiToken']) ? Yii::$app->params['apiToken'] : null;
    }

    public function getResponseLang()
    {
        return isset(Yii::$app->params['apiResponseLang']) ? Yii::$app->params['apiResponseLang'] : 'en';
    }

    public function beforeValidate()
    {
        if (!$this->lang) $this->lang = $this->responseLang;
        return parent::beforeValidate();
    }
}