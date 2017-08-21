module.exports = angular.module('travelPayoutsApp').component('priceComponent', {
    bindings: {
        currency: '<',
        price: '<',
    },
    templateUrl: './templates/components/price.html',
    controller: function ($scope, currencyFactory) {
        var self = this;
        self.currentCurrency = {};
        self.convertedPrice = 0;
        self.currencyList = currencyFactory.getData();
        self.onChangeCurrency = function () {
            self.currentCurrency = currencyFactory.get();
            convertPrice(self.price, self.currency, self.currentCurrency.id);
        };

        function convertPrice(value, from, to) {
            var basePrice = value * self.currencyList[from];
            self.convertedPrice = basePrice / self.currencyList[to];
        }

        self.$onChanges = function () {
            self.onChangeCurrency();
        };
        $scope.$on('changeCurrency', function () {
            self.onChangeCurrency();
        });
    }
}).filter('roundto', function () {
    return function (input) {
        return parseFloat(input).toFixed(2).replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1 ");
    };
});