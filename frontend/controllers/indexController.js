var indexController = angular.module('travelPayoutsApp').controller('indexController', function ($scope, $stateParams, tmhDynamicLocale, $state, $transitions, $window, $timeout) {
    $scope.searchData = angular.copy($stateParams);
    $scope.searchUrl = $window.location.search;

    $transitions.onSuccess({}, function () {
        $timeout(function () {
            $scope.searchUrl = $window.location.search;
        }, 100);
    });

    $scope.submit = function () {
        $scope.$broadcast('initNewSearch');
        $timeout(function () {
            $state.go('search', $scope.searchData);
            $scope.searchUrl = $window.location.search;
        }, 200);
    };

    //Sticky header
    $scope.stickyTop = false;
    angular.element($window).bind("scroll", function () {
        if ($(window).scrollTop() > 65) {
            $scope.stickyTop = true;
        } else {
            $scope.stickyTop = false;
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    // Click on body to hide all opened popovers
    $scope.$watch('stickyTop', function (oldVal, newVal) {
        if (oldVal !== newVal) {
            $(document).find('body').click();
        }
    });
});

module.exports = indexController;