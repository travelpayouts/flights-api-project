<?php

$params = [
    'adminEmail' => 'admin@example.com',
    'apiToken' => '', // Token https://www.travelpayouts.com/developers/api
    'apiMarker' => '',  // Marker https://www.travelpayouts.com/developers/api
    'apiResponseLang' => 'en', // Response language : en,ru,de,es,fr,it,pl,th.
    'title' => 'TravelPayouts sample app', // Title of your app
    'baseUrl' => ''
];

// Don't change anything below this line
$localParamsPath = __DIR__ . DIRECTORY_SEPARATOR . 'params_local.php';
if (file_exists($localParamsPath))
    $params = array_merge($params, require($localParamsPath));

return $params;
