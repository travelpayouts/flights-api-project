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
use yii\data\ActiveDataProvider;
use thewulf7\travelPayouts\Travel;

class Search extends Model
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
    private $apiToken;
    private $apiMarker;
    private $apiResponseLang;


    /**
     * @return array the validation rules.
     */


    //@TODO Валидатор который предусматривет то, что дата возврата не меньше даты отпарвления и наоборот
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

    /**
     * Check config parameters before validation
     * @return bool
     */
    public function beforeValidate()
    {
        // Get Api parameters from params.php file
        $apiParams = array_filter(Yii::$app->params, function ($key) {
            return preg_match('/(^api)/iu', $key);
        }, ARRAY_FILTER_USE_KEY);

        foreach ($apiParams as $paramName => $paramValue) {
            if (empty($paramValue)) {
                // Return validation error if some of api params is Empty
                $this->addError($paramName, Yii::t('yii', '{attribute} cannot be blank.', array(
                    'attribute' => $paramName
                )));
            } else {
                // Is value is not empty, assign value to property
                $this->$paramName = $paramValue;
            }
        }
        if (!$this->lang) {
            $this->lang = $this->apiResponseLang;
        }

        return parent::beforeValidate();
    }

    public function getTripClass()
    {
        return $this->trip_class == '0' ? 'Y' : 'C';
    }


    public function search()
    {
        // Init Api
        $api = new Travel($this->apiToken);
        $flightService = $api->getFlightService();

        $flightService
            ->setIp($_SERVER['REMOTE_ADDR'])
            ->setHost($_SERVER['HTTP_HOST'])
            ->setMarker($this->apiMarker)
            ->addPassenger('adults', $this->adults)
            ->addSegment($this->origin, $this->destination, $this->depart_date);

        // Two way tickets
        if ($this->return_date) {
            $flightService->addSegment($this->destination, $this->origin, $this->return_date);
        }
        // Add childrens
        if ($this->children) {
            $flightService->addPassenger('children', $this->children);
        }
        // Add infants
        if ($this->infants) {
            $flightService->addPassenger('infants', $this->infants);
        }
        // Let's go searching
        $searchData = $flightService->search($this->lang, $this->tripClass);


        return $searchData;
    }
}