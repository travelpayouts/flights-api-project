export const mainController = /* @ngInject */ function (
    $scope,
    currencyFactory,
) {
    currencyFactory.set('usd');
    $scope.currency = currencyFactory.get();
    $scope.currencyList = currencyFactory.getLabels();

    $scope.setCurrency = function (item) {
        currencyFactory.set(item.id);
        $scope.currency = currencyFactory.get();
        $scope.$broadcast('changeCurrency');
    };
};
