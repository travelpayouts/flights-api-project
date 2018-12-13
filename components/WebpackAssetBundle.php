<?php
/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */

namespace app\components;

use Yii;
use yii\web\AssetBundle;
use yii\helpers\Json;
use yii\helpers\Url;

class WebpackAssetBundle extends AssetBundle
{
    public $chunks = [];
    public $assetsUrl;
    public $statsPath;

    protected $_webpackAssets = [];

    public function init()
    {
        $assets = $this->getWebpackAssets();

        $usedAssets = array_filter($assets, function ($assetName) {
            return in_array($assetName, $this->chunks);
        }, ARRAY_FILTER_USE_KEY);

        foreach ($this->chunks as $chunk) {
            if (isset($usedAssets[$chunk])) {
                $asset = $usedAssets[$chunk];

                if (is_string($asset)) {
                    $this->addAsset($asset);
                } elseif (is_array($asset)) {
                    foreach ($asset as $file) {
                        $this->addAsset($file);
                    }
                }
            }
        }
        parent::init();
    }

    private function addAsset($name)
    {
        if (preg_match('/\.(?<ext>js|css)$/', $name, $matches)) {
            $extension = $matches['ext'];
            $this->{$extension}[] = $this->getAssetsUrl() . '/' . $name;
            return true;
        }
        return false;
    }

    private function getWebpackAssets()
    {
        if (!$this->_webpackAssets) {
            $webpackStatsPath = Yii::getAlias($this->statsPath);
            if (file_exists($webpackStatsPath)) {
                $webpackStats = Json::decode(file_get_contents($webpackStatsPath));
                if (isset($webpackStats['assetsByChunkName'])) {
                    $this->_webpackAssets = $webpackStats['assetsByChunkName'];
                }
            } else {
                throw new \Exception('It seems that you are forgot to compile your frontend files with webpack. Check documentation at https://github.com/travelpayouts/flights-api-project');
            }
        }
        return $this->_webpackAssets;
    }

    protected function getAssetsUrl()
    {
        if ($this->assetsUrl) {
            return Url::to($this->assetsUrl);
        }
        return null;
    }
}