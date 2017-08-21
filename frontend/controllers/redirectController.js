module.exports = angular.module('travelPayoutsApp').controller('redirectController', function ($scope, $sce, $timeout,$http, $stateParams) {
    $scope.resolved = false;
    $scope.data = {};

    $scope.getData = function () {
        return $http({
            method: 'POST',
            url: './api/search/redirect/' + $stateParams.searchId + '/' + $stateParams.urlId
        }).then(function (response) {
            $scope.resolved = true;
            $scope.data = response.data;
            if(response.data.error ===undefined){
                $timeout(function () {
                    if ($scope.data.method === "GET") {
                        window.location.replace($scope.data.url);
                    } else {
                        angular.element('#redirect_params_form').submit();
                    }
                }, 3000);
            }
        });
    };
    $scope.getData();
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    };
});