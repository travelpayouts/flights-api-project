export const priceComponent = {
    bindings: {
        currency: '<',
        price: '<',
    },

    templateUrl: './templates/components/price.html',

    controller: /* @ngInject */ function ($scope, currencyFactory) {
        this.currentCurrency = {};
        this.convertedPrice = 0;
        this.currencyList = currencyFactory.getData();
        const convertPrice = (value, from, to) => {
            let basePrice = value * this.currencyList[from];
            this.convertedPrice = basePrice / this.currencyList[to];
        };
        this.onChangeCurrency = () => {
            this.currentCurrency = currencyFactory.get();
            convertPrice(this.price, this.currency, this.currentCurrency.id);
        };

        this.$onChanges = () => {
            this.onChangeCurrency();
        };
        $scope.$on('changeCurrency', () => {
            this.onChangeCurrency();
        });
    },
};
