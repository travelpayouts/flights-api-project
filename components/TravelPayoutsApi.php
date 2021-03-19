<?php
/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

namespace app\components;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Http\Message\ResponseInterface;
use RuntimeException;
use Yii;
use yii\base\BaseObject;
use yii\base\ErrorException;
use yii\helpers\Json;

/**
 * Class TravelPayoutsApi
 * @package app\components
 * @property string $locale
 * @property string $ip
 */
class TravelPayoutsApi extends BaseObject
{
    /**
     * @var string
     */
    public $token;

    /**
     * @var string
     */
    public $marker;

    /**
     * @var string
     */
    public $host;

    /**
     * @var Client
     */
    private $_client;

    /**
     * @var string
     */
    protected $_locale = 'en';

    public function init(): void
    {
        if (!$this->token && !$this->marker) {
            throw new ErrorException(
                Yii::t('main', 'Can\'t find required params "{attribute}"', [
                    'attribute' => 'token,marker',
                ])
            );
        }

        $this->_client = new Client([
            'base_uri' => 'https://api.travelpayouts.com',
            'headers' => [
                'Content-Type' => 'application/json',
                'X-Access-Token' => $this->token,
                'Accept-Encoding' => 'gzip,deflate,sdch',
            ],
        ]);
    }

    protected function getAuthEndpointQuery(
        array $query = [],
        bool $useSignature = true
    ): array {
        $requestQuery = array_merge($query, [
            'marker' => $this->marker,
            'host' => $this->host,
            'user_ip' => $this->getIp(),
            'locale' => $this->locale,
        ]);
        if ($useSignature) {
            $requestQuery = array_merge($requestQuery, [
                'signature' => $this->getSignature($requestQuery),
            ]);
        }
        return $requestQuery;
    }

    /**
     * @return string
     */
    public function getLocale(): string
    {
        return $this->_locale;
    }

    /**
     * @param string|null $value
     */
    public function setLocale(?string $value): void
    {
        $predefinedLocaleList = ['en', 'ru', 'de', 'fr', 'it', 'pl', 'th'];
        if (in_array($value, $predefinedLocaleList, true)) {
            $this->_locale = $value;
        }
    }

    /**
     * @param $uri
     * @param array $options
     * @return array
     * @throws GuzzleException
     */
    protected function post($uri, array $options = []): array
    {
        return $this->processResponse($this->getClient()->post($uri, $options));
    }

    /**
     * @param $uri
     * @param array $options
     * @return array
     * @throws GuzzleException
     */
    protected function get($uri, array $options = []): array
    {
        return $this->processResponse($this->getClient()->get($uri, $options));
    }

    /**
     * @param ResponseInterface $response
     * @return array
     */
    protected function processResponse(ResponseInterface $response): array
    {
        $statusCode = $response->getStatusCode();
        $responseBody = (string) $response->getBody();
        $data = Json::decode($responseBody, true);

        if (!$data) {
            throw new RuntimeException(
                "Unable to decode json response: $responseBody"
            );
        }

        if ($statusCode !== 200) {
            $message = $data['message'] ?? 'unknown';
            throw new RuntimeException("{$statusCode}:{$message}");
        }
        return $data;
    }

    /**
     * Transform request options to signature format
     * @param $options
     * @return array
     */
    protected function processSignatureQuery($options): array
    {
        $result = [];
        if (is_array($options)) {
            foreach ($options as $key => $value) {
                if (is_array($value)) {
                    $result[$key] = implode(
                        ':',
                        $this->processSignatureQuery($value)
                    );
                } else {
                    $result[$key] = (string) $value;
                }
            }
        }
        ksort($result);
        return $result;
    }

    /**
     * @param array $query
     * @return string
     */
    protected function getSignature(array $query): string
    {
        return md5(
            implode(
                ':',
                array_merge(
                    [$this->token],
                    $this->processSignatureQuery($query)
                )
            )
        );
    }

    /**
     * @return Client
     */
    protected function getClient(): Client
    {
        return $this->_client;
    }

    /**
     * @return mixed
     */
    protected function getIp()
    {
        return $_SERVER['HTTP_X_REAL_IP'] ??
            Yii::$app->getRequest()->getUserIP();
    }

    /**
     * Alias for search tickets
     * @param array $query
     * @return mixed
     * @throws GuzzleException
     */
    public function searchFlightsTickets(array $query = []): array
    {
        return $this->post('/v1/flight_search', [
            'json' => $this->getAuthEndpointQuery($query),
        ]);
    }

    /**
     * Get search results
     * @param string $uuid Search ID
     * @return mixed
     * @throws GuzzleException
     */
    public function getResultsById(string $uuid): array
    {
        return $this->get('/v1/flight_search_results?uuid=' . $uuid);
    }

    /**
     * @param $id
     * @param $url
     * @return array
     * @throws GuzzleException
     */
    public function getRedirectUrl($id, $url): array
    {
        return $this->get(
            "http://api.travelpayouts.com/v1/flight_searches/{$id}/clicks/{$url}.json"
        );
    }
}
