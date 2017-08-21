var findIndex = require('lodash/findIndex');
module.exports = angular.module('travelPayoutsApp').factory('currencyFactory', function () {
    var currency = {
        list: [
            {id: 'usd', label: 'US dollar', sign: '$', view: 'start'},
            {id: 'eur', label: 'Euro', sign: '€', view: 'end'},
            {id: 'rub', label: 'Ruble', sign: '&#8381;', view: 'end'}
        ],
        rate: {},
        value: ""
    };

    return {
        getLabels: function () {
            return currency.list;
        },
        get: function () {
            var list = currency.list;
            var fieldIndex = findIndex(list, {'id': currency.value});
            if (fieldIndex !== -1) {
                return list[fieldIndex];
            }
            return false;
        },
        set: function (id) {
            var list = currency.list;
            if (findIndex(list, {'id': id}) !== -1) {
                currency.value = id;
                return true;
            }
            return false;
        },
        setData: function (data) {
            currency.rate = data;
        },
        getData: function () {
            return currency.rate;
        }
    }
});