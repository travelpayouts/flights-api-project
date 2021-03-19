<?php
/**
 * Created by PhpStorm.
 * User: andrey
 * Date: 22.07.17
 * Time: 18:44
 */

namespace app\models;

use app\components\TravelPayoutsApi;
use Yii;
use yii\base\Model;

/**
 * Class FlightsSearch
 * @package app\models
 * @property $responseLang
 * @property $tripClass
 */
class FlightsSearch extends Model
{
    public $origin;
    public $destination;
    public $adults = 0;
    public $children = 0;
    public $infants = 0;
    public $_trip_class;
    public $depart_date;
    public $return_date;


	public function fields(): array
	{
		return ['passengers', 'segments', 'trip_class'];
	}


	/**
     * @return array the validation rules.
     */
    public function rules(): array
    {
        return [
            [
                [
                    'origin',
                    'destination',
                    'adults',
                    'trip_class',
                    'depart_date',
                ],
                'required',
            ],
            [
                ['adults', 'children', 'infants'],
                'integer',
                'integerOnly' => true,
                'min' => 0,
                'max' => 9,
            ],
            [['depart_date', 'return_date'], 'date', 'format' => 'php:Y-m-d'],
            [['depart_date', 'return_date'], 'dateValidator'],
            ['infants', 'infantsValidator'],
        ];
    }

    /**
     * Validate date
     * @param $attribute_name
     * @return bool
     * @throws \Exception
     */
    public function dateValidator($attribute_name): bool
    {
        $attributeData = strtotime($this->$attribute_name);
        if ($attribute_name === 'depart_date') {
            $today = new \DateTime();
            $today->setTime(0, 0);
            if ($today->getTimestamp() > $attributeData) {
                $this->addError(
                    $attribute_name,
                    Yii::t('main', 'Depart date must be in future')
                );
                return false;
            }
        }
        if ($attribute_name === 'return_date') {
            if ($attributeData < strtotime($this->depart_date)) {
                $this->addError(
                    $attribute_name,
                    Yii::t('main', 'Return date must be more than depart date')
                );
                return false;
            }
        }
        if ($attributeData > strtotime('+ 1 year')) {
            $this->addError(
                $attribute_name,
                Yii::t(
                    'main',
                    '{attribute} can not exceed a year from the current date',
                    [
                        'attribute' => $this->getAttributeLabel(
                            $attribute_name
                        ),
                    ]
                )
            );
        }
        return true;
    }

    /**
     * Validate count of Infants
     * @param $attribute_name
     * @return bool
     */
    public function infantsValidator($attribute_name): bool
    {
        $attributeData = (int) $this->$attribute_name;
        $adultChildrenData = [
            'adults' => $this->adults,
            'children' => $this->children,
        ];
        $adultChildrenDataSum = array_sum($adultChildrenData);

        if ($attributeData > $adultChildrenDataSum) {
            $this->addError(
                $attribute_name,
                Yii::t(
                    'main',
                    'Infants can not exceed sum of adults and children'
                )
            );
            return false;
        }
        return true;
    }

    /**
     * @return array customized attribute labels
     */
    public function attributeLabels(): array
    {
        return [
            'origin' => Yii::t('main', 'Origin'),
            'destination' => Yii::t('main', 'Destination'),
            'adults' => Yii::t('main', 'Adults'),
            'children' => Yii::t('main', 'Children'),
            'infants' => Yii::t('main', 'Infants'),
            'trip_class' => Yii::t('main', 'Trip class'),
            'depart_date' => Yii::t('main', 'Depart date'),
            'return_date' => Yii::t('main', 'Return date'),
        ];
    }

    public function getTripClass(): string
    {
        return (int) $this->_trip_class === 0 ? 'Y' : 'C';
    }

    protected function getTrip_class()
    {
        return $this->_trip_class;
    }

    protected function setTrip_class($value)
    {
        $this->_trip_class = (int) $value === 0 ? 'Y' : 'C';
    }

	protected function getSegments(): array
    {
        $result = [
            [
                'origin' => $this->origin,
                'destination' => $this->destination,
                'date' => $this->depart_date,
            ],
        ];

        if ($this->return_date) {
            $result = array_merge($result, [
                [
                    'origin' => $this->destination,
                    'destination' => $this->origin,
                    'date' => $this->return_date,
                ],
            ]);
        }
        return $result;
    }

    protected function getPassengers(): array
    {
        return [
            'adults' => $this->adults,
            'children' => $this->children,
            'infants' => $this->infants,
        ];
    }

	/**
     * @return TravelPayoutsApi
     */
    protected function getApi(): TravelPayoutsApi
    {
        return Yii::$app->travelpayoutsApi;
    }
}
