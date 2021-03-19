export const redirectController = /* @ngInject */ function (
    $scope,
    $sce,
    $timeout,
    $http,
    $stateParams,
) {
    $scope.resolved = false;
    $scope.data = {};

    $scope.getData = () =>
        $http({
            method: 'POST',
            url: `./api/search/redirect/${$stateParams.searchId}/${$stateParams.urlId}`,
        }).then((response) => {
            $scope.resolved = true;
            $scope.data = response.data;
            if (response.data.error === undefined) {
                $timeout(() => {
                    if ($scope.data.method === 'GET') {
                        window.location.replace($scope.data.url);
                    } else {
                        angular.element('#redirect_params_form').submit();
                    }
                }, 3000);
            }
        });
    $scope.getData();
    $scope.trustSrc = (src) => $sce.trustAsResourceUrl(src);
};
