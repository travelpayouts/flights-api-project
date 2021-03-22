export const searchController = /* @ngInject */ function (
    $scope,
    searchRequest,
    $stateParams,
    $http,
    $timeout,
    currencyFactory,
) {
    let count = 1;
    $scope.$parent.searchData = $stateParams;
    // Is request complete (in percent)
    $scope.complete = 0;
    $scope.searchRequest = searchRequest;
    $scope.searchResults = [];
    $scope.currencyRates = currencyFactory.getData();
    if ($scope.searchRequest.status === 'ok') {
        if ($scope.searchRequest.data.search_id !== undefined) {
            $scope.searchResults = [];
            $scope.searchId = $scope.searchRequest.data.search_id;
            doSearch();
        }
    }

    //Prevent new request after change state
    $scope.$on('initNewSearch', () => {
        if ($scope.doSearchPromise !== undefined) {
            $timeout.cancel($scope.doSearchPromise);
        }
    });

    function doSearch() {
        return $http({
            method: 'GET',
            url: `./api/search/${$scope.searchRequest.data.search_id}`,

            params: {
                count,
            },
        }).then((response) => {
            let lastElement = response.data[response.data.length - 1];
            Array.prototype.push.apply($scope.searchResults, response.data);
            $scope.$broadcast('searchUpdated');
            if (Object.keys(lastElement).length > 2) {
                $scope.complete += 15;
            } else {
                $scope.complete = 100;
            }
            count++;

            $scope.doSearchPromise = $timeout(() => {
                if (Object.keys(lastElement).length > 2) {
                    return doSearch();
                } else {
                    $scope.$broadcast('searchCompleted');
                }
            }, 5000);
        });
    }
};
