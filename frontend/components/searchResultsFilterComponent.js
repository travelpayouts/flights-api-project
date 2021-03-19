import {map, maxBy, minBy} from 'lodash';

export const searchResultsFilterComponent = {
    templateUrl: './templates/components/searchResultsFilter.html',

    bindings: {
        count: '<',
        limit: '<',
        airports: '<',
        filtersBoundary: '<',
        orderBy: '=',
        filterBy: '=',
    },

    controller: /* @ngInject */ function (
        $scope,
        $timeout,
        $filter,
        currencyFactory,
    ) {
        let self = this;
        let currency = currencyFactory.get();
        let currencyList = currencyFactory.getData();

        self.sortingParams = [
            {id: 'price', label: 'Price'},
            {id: 'duration', label: 'Travel time'},
            {id: 'dateAsc', label: 'Early flight'},
            {id: 'dateDesc', label: 'Later flight'},
        ];

        self.stopsCount = [];

        // Toggle selection for a given fruit by name
        self.toggleSelection = function toggleSelection(type, value) {
            // Create field filter if not exist
            if (self.filterBy[type] === undefined) self.filterBy[type] = [];
            let idx = self.filterBy[type].indexOf(value);
            // Is currently selected
            if (idx > -1) {
                self.filterBy[type].splice(idx, 1);
                // Delete empty field filter
                if (self.filterBy[type].length === 0)
                    delete self.filterBy[type];
            }
            // Is newly selected
            else {
                self.filterBy[type].push(value);
            }
        };

        self.isEmptyFilter = () => Object.keys(self.filterBy).length <= 2;

        self.clearFilter = function () {
            self.filterBy = {
                price: {
                    min: self.priceSlider.floor,
                    max: self.priceSlider.ceil,
                },
                duration: {
                    min: self.durationSlider.floor,
                    max: self.durationSlider.ceil,
                },
            };
        };

        self.priceSlider = {
            floor: 0,
            ceil: 1,

            translate(value) {
                let price = (value / currencyList[currency.id]).toFixed(0);
                return currency.view === 'start'
                    ? `${currency.sign} ${price}`
                    : `${price} ${currency.sign}`;
            },
        };

        self.durationSlider = {
            floor: 0,
            ceil: 1,
            translate: (value) => $filter('secondsToTime')(value * 60),
        };

        self.$onInit = function () {
            searchUpdated();
        };
        $scope.$on('searchUpdated', () => {
            searchUpdated();
        });

        $scope.$on('changeCurrency', () => {
            currency = currencyFactory.get();
            $timeout(() => {
                $scope.$broadcast('rzSliderForceRender');
            }, 200);
        });

        function searchUpdated() {
            let stopCounts = [];
            let filterData = map(self.filtersBoundary, (item) => {
                let newItem = {
                    priceMin: item.price.min,
                    priceMax: item.price.max,
                    durationMin: item.flights_duration.min,
                    durationMax: item.flights_duration.max,
                };
                angular.merge(stopCounts, Object.keys(item.stops_count));
                return newItem;
            });

            self.stopsCount = stopCounts;

            self.filterBy.duration = {
                min: minBy(filterData, 'durationMin').durationMin,
                max: maxBy(filterData, 'durationMax').durationMax * 1.5,
            };

            self.durationSlider.floor = minBy(
                filterData,
                'durationMin',
            ).durationMin;
            self.durationSlider.ceil =
                maxBy(filterData, 'durationMax').durationMax * 1.5;

            self.filterBy.price = {
                min: minBy(filterData, 'priceMin').priceMin,
                max: maxBy(filterData, 'priceMax').priceMax,
            };

            self.priceSlider.floor = minBy(filterData, 'priceMin').priceMin;
            self.priceSlider.ceil = maxBy(filterData, 'priceMax').priceMax;
        }
    },
};

export const searchFilterPanelComponent = {
    transclude: true,
    templateUrl: './templates/components/searchFilterPanel.html',

    bindings: {
        title: '<',
    },

    controller($element) {
        $element.addClass('filter__panel');
    },
};
