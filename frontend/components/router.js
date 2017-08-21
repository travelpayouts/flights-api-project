module.exports = angular.module('travelPayoutsApp').config(function ($stateProvider, $locationProvider) {
    var mainState = {
        name: 'main',
        controller: 'mainController',
        templateUrl: './templates/main.html',
    };

    var indexState = {
        parent: 'main',
        name: 'index',
        url: '/',
        controller: 'indexController',
        templateUrl: './templates/index.html'
    };

    var searchState = {
        parent: 'index',
        name: 'search',
        url: 'search?origin&destination&adults&children&infants&depart_date&return_date&trip_class',
        controller: 'searchController',
        templateUrl: './templates/search.html',
        params: {
            depart_date: null,
            return_date: null,
            adults: '1',
            infants: '0',
            children: '0',
            trip_class: '0',
            origin: undefined,
            destination: undefined
        },
        resolve: {
            searchRequest: function ($http, $stateParams, $state, Notification, currencyFactory) {
                return $http({
                    method: 'POST',
                    url: './api/search',
                    data: $stateParams
                })
                    .then(function (response) {
                        if (response.data.status === 'ok') {
                            if (response.data.data.currency_rates !== undefined) {
                                currencyFactory.setData(response.data.data.currency_rates);
                                currencyFactory.requestCurrency = response.data.data.currency;
                            }
                            return response.data;
                        } else {
                            angular.forEach(response.data.data, function (field) {
                                angular.forEach(field, function (message) {
                                    Notification.error({message: message, delay: 3000});
                                });
                            });
                            //Prevent changing state
                            if ($state.$current.name !== '') {
                                $state.go('.');
                            } else {
                                $state.go('index');
                            }
                        }
                    });
            }
        }
    };

    var redirectState = {
        name: 'redirect',
        url: '/redirect/{searchId}/{urlId}',
        controller: 'redirectController',
        templateUrl: './templates/redirect.html'
    };

    $stateProvider
        .state(mainState)
        .state(indexState)
        .state(searchState)
        .state(redirectState)
    ;


    $locationProvider.html5Mode(true);
});