<?php
/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

namespace app\components;

use Yii;
use GuzzleHttp\Client;
use yii\helpers\Json;

class TravelPayoutsApi
{
    const API_HOST = 'http://api.travelpayouts.com';
    /**
     * @var Client
     */
    private $_client;

    /**
     * @var string
     */
    private $_token;

    /**
     * @var int
     */
    private $_marker;

    /**
     * @var string
     */
    private $_host;

    /**
     * @var array
     */
    private $_segments = [];

    /**
     * @var array
     */
    private $_passengers = [
        'adults' => 0,
        'children' => 0,
        'infants' => 0,
    ];

    /**
     * @param $token
     */
    public function __construct($token)
    {
        $this->_token = $token;

        $this->_client = new Client(
            [
                'base_uri' => self::API_HOST,
                'headers' =>
                    [
                        'Content-Type' => 'application/json',
                        'X-Access-Token' => $this->_token,
                        'Accept-Encoding' => 'gzip,deflate,sdch',
                    ],
            ]
        );
    }

    /**
     * @param string $locale
     * @param string $trip_class
     *
     * @return mixed
     * @throws \RuntimeException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getSearch($locale = 'ru', $trip_class = 'Y')
    {
        $url = '/v1/flight_search';

        $options = [
            'json' => [
                'marker' => $this->getMarker(),
                'host' => $this->getHost(),
                'user_ip' => $this->getIp(),
                'locale' => in_array($locale, ['en', 'ru', 'de', 'fr', 'it', 'pl', 'th'], true) ? $locale : 'ru',
                'trip_class' => in_array($trip_class, ['Y', 'C'], true) ? $trip_class : 'Y',
                'passengers' => $this->getPassengers(),
                'segments' => $this->getSegments(),
            ],
        ];

        $options['json']['signature'] = $this->getSignature($options['json'], true);

        return $this->execute($url, $options, 'POST', false);
    }

    /**
     * Get search results
     *
     * @param string $uuid Search ID
     *
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getSearchResults($uuid)
    {
        $url = '/v1/flight_search_results';

        $options = [
            'uuid' => $uuid,
        ];

        return $this->execute($url, $options);
    }


    public function getRedirectUrl($id, $url)
    {
        $url = "http://api.travelpayouts.com/v1/flight_searches/{$id}/clicks/{$url}.json";
        return $this->execute($url, []);
    }

    /**
     * @param string $url
     * @param array $options
     * @param string $type
     * @param bool|true $replaceOptions
     *
     * @return mixed
     * @throws \RuntimeException
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function execute($url, array $options, $type = 'GET', $replaceOptions = true)
    {
        $params = [
            'http_errors' => false,
        ];

        if ($replaceOptions) {
            $paramName = $type === 'GET' ? 'query' : 'body';
            $params[$paramName] = $options;
        } else {
            $params += $options;
        }

        $res = $this->getClient()->request($type, $url, $params);

        $statusCode = $res->getStatusCode();
        $body = $res->getBody();
        if ($statusCode !== 200) {
            $strBody = Json::decode((string)$body);
            $message = isset($strBody['message']) ? $strBody['message'] : 'unknown';

            throw new \RuntimeException("{$statusCode}:{$message}");
        }

        return $this->makeApiResponse($body);
    }

    /**
     * @param $jsonString
     *
     * @return mixed
     * @throws \RuntimeException
     */
    private function makeApiResponse($jsonString)
    {
        $data = Json::decode($jsonString, true);
        if (!$data) {
            throw new \RuntimeException("Unable to decode json response: $jsonString");
        }

        return $data;
    }

    /**
     * @param array $options
     * @param boolean $withToken
     * @return string
     */
    public function getSignature(array $options, $withToken = false)
    {
        ksort($options);

        ksort($options['passengers']);

        foreach ($options['segments'] as $key => $value) {
            ksort($value);
            $options['segments'][$key] = implode(':', $value);
        }

        $options['passengers'] = implode(':', $options['passengers']);
        $options['segments'] = implode(':', $options['segments']);

        if ($withToken) $options = array_merge([$this->_token], $options);

        return md5(implode(':', $options));
    }

    /**
     * @return \GuzzleHttp\Client
     */
    protected function getClient()
    {
        return $this->_client;
    }

    /**
     * @return mixed
     */
    public function getMarker()
    {
        return $this->_marker;
    }

    /**
     * @param mixed $marker
     *
     * @return $this
     */
    public function setMarker($marker)
    {
        $this->_marker = $marker;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getHost()
    {
        return $this->_host;
    }

    /**
     * @param mixed $host
     *
     * @return $this
     */
    public function setHost($host)
    {
        $this->_host = $host;

        return $this;
    }

    /**
     * @return mixed
     */
    protected function getIp()
    {
        return isset($_SERVER['HTTP_X_REAL_IP']) ? $_SERVER['HTTP_X_REAL_IP'] : Yii::$app->getRequest()->getUserIP();
    }

    /**
     * @return array
     */
    public function getSegments()
    {
        return $this->_segments;
    }

    /**
     * Add segment
     *
     * @param string $origin
     * @param string $destination
     * @param string $date
     *
     * @return $this
     * @throws \Exception
     */
    public function addSegment($origin, $destination, $date)
    {
        $date = new \DateTime($date);

        $this->_segments[] = [
            'origin' => $origin,
            'destination' => $destination,
            'date' => $date->format('Y-m-d'),
        ];

        return $this;
    }

    /**
     * Clear all segments
     *
     * @return $this
     */
    public function clearSegments()
    {
        $this->_segments = [];

        return $this;
    }

    /**
     * @return array
     */
    public function getPassengers()
    {
        return $this->_passengers;
    }

    /**
     * Add $count passenger of $type type
     *
     * @param string $type
     * @param int $count
     *
     * @return $this|bool
     */
    public function addPassenger($type, $count = 1)
    {
        if (isset($this->_passengers[$type])) {
            $this->_passengers[$type] += $count;

            return $this;
        }

        return false;
    }

    /**
     * Remove $count passengers of $type type
     *
     * @param string $type
     * @param int $count
     *
     * @return $this|bool
     */
    public function removePassenger($type, $count = 1)
    {
        if (isset($this->_passengers[$type])) {
            $this->_passengers[$type] -= $count;

            return $this;
        }

        return false;
    }

    /**
     * Remove all passengers
     *
     * @return $this
     */
    public function clearPassengers()
    {
        $this->_passengers = [];

        return $this;
    }

}