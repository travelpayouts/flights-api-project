import {flattenDeep, intersection, minBy, maxBy} from 'lodash';

export const searchResultsComponent = {
    templateUrl: './templates/components/searchResults.html',

    bindings: {
        searchId: '<',
        results: '<',
    },

    controller: /* @ngInject */ function ($scope, currencyFactory) {
        let self = this;
        let resultsLength = undefined;
        let currencyList = currencyFactory.getData();
        self.proposals = [];
        self.airports = {};
        self.airlines = {};
        self.gates = {};
        self.filtersBoundary = [];
        // Initial sort,filter params
        self.orderByParam = 'price';
        self.filterByParam = {};
        self.limit = 10;
        self.showMore = function () {
            self.limit += 10;
        };
        this.$onInit = function () {
            resultsLength = self.results.length;
            self.completed = false;
        };

        let proposalIndex = [];
        $scope.$on('searchUpdated', () => {
            let lastElement = self.results[self.results.length - 1];
            resultsLength = self.results.length;
            angular.forEach(self.results, (gate) => {
                angular.merge(self.airports, gate.airports);
                angular.merge(self.airlines, gate.airlines);
                angular.merge(self.gates, gate.gates_info);
                if (gate.filters_boundary !== undefined) {
                    self.filtersBoundary.push(gate.filters_boundary);
                }
                // Save and update existing proposals
                angular.forEach(gate.proposals, (proposal) => {
                    if (proposalIndex.indexOf(proposal.sign) === -1) {
                        self.proposals.push(proposal);
                        proposalIndex.push(proposal.sign);
                    } else {
                        let key = self.proposals.findIndex(
                            (item) => item.sign === proposal.sign,
                        );
                        // Merge prices
                        if (key !== -1) {
                            self.proposals[key] = angular.merge(
                                self.proposals[key],
                                {terms: proposal.terms},
                            );
                        }
                    }
                });
            });
            if (Object.keys(lastElement).length === 1) {
                self.completed = true;
            }
        });

        self.orderBy = function (item) {
            let result = 0;
            if (self.orderByParam === 'price') {
                let rate = 1;

                let terms = Object.keys(item.terms).map(
                    (key) => item.terms[key],
                );
                if (terms !== undefined) {
                    let minPriceItem = minBy(terms, (term) =>
                        parseFloat(term.price),
                    );
                    let termPrice = parseFloat(minPriceItem.price);

                    if (currencyList[minPriceItem.currency] !== undefined) {
                        rate = currencyList[minPriceItem.currency];
                    }
                    result = termPrice * rate;
                }
            } else if (self.orderByParam === 'dateAsc') {
                result = item.segments_time[0][0];
            } else if (self.orderByParam === 'dateDesc') {
                result = -item.segments_time[0][0];
            } else if (self.orderByParam === 'duration') {
                result = item.total_duration;
            }
            return result;
        };

        self.filterByAirport = function (item, value) {
            if (value.length === 0) return true;
            let airports = flattenDeep([
                item.segments_airports,
                item.stops_airports,
            ]);
            return intersection(airports, value).length > 0;
        };

        self.filterByDuration = function (item, value) {
            if (value.length === 0) return true;
            return (
                item.total_duration + 10 >= value.min &&
                item.total_duration - 10 <= value.max
            );
        };

        self.filterByPrice = function (item, value) {
            if (value.length === 0) return true;
            let terms = Object.values(item.terms);
            let priceItems = {
                min: minBy(terms, 'unified_price'),
                max: maxBy(terms, 'unified_price'),
            };
            return (
                priceItems.min.unified_price >= value.min &&
                priceItems.max.unified_price <= value.max
            );
        };

        self.filterByStops = function (item, value) {
            if (value.length === 0) return true;
            return value.indexOf(item.max_stops.toString()) !== -1;
        };

        self.filterBy = function (item) {
            let resultObj = {};
            angular.forEach(self.filterByParam, (data, type) => {
                let functionName = `filterBy${type
                    .charAt(0)
                    .toUpperCase()}${type.slice(1)}`;
                // Check if filter function exists
                if (eval(`typeof self.${functionName}`) !== 'undefined') {
                    resultObj[functionName] = self[functionName](item, data);
                }
            });
            let resultValues = Object.values(resultObj);
            return resultValues.every((element, index, array) => element);
        };

        self.isEmptyFilter = () => Object.keys(self.filterByParam).length === 0;
    },
};
