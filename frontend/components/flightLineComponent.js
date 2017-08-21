var findIndex = require('lodash/findIndex');

module.exports = angular.module('travelPayoutsApp').component('flightLine', {
    templateUrl: './templates/components/flightLine.html',
    bindings: {
        flights: '<',
        first: '<',
        last: '<'
    },
    require: {
        parent: '^^searchResultsItem'
    },
    controller: function ($element) {
        var self = this;
        self.airports = [];
        self.cities = [];
        var directions = ['departure', 'arrival'];
        var originDep = {};
        self.travelDirection = {
            departure: 'Departure from',
            arrival: 'Arrival to',
            change: 'Change airport to'
        };


        self.$onChanges = function () {
            self.airportsData = self.parent.airports;
            originDep[self.first] = 'first';
            originDep[self.last] = 'last';
            setAirportsData();

        };

        function setAirportsData() {
            angular.forEach(self.flights, function (flight) {
                angular.forEach(directions, function (direction) {
                    var airportValues = pickBykey(flight, direction);
                    var airport = airportValues.airport;
                    var city = self.airportsData[airport].city_code;
                    airportValues.direction = direction;

                    var airportsIndex = findIndex(self.airports, {city: city});
                    if (airportsIndex === -1) {
                        var data = {
                            city: city,
                            status: originDep[airport] !== undefined ? originDep[airport] : '',
                            data: [airportValues],
                            airports: [airport]
                        };
                        self.airports.push(data);
                    } else {
                        self.airports[airportsIndex].data.push(airportValues);
                        if (self.airports[airportsIndex].airports.indexOf(airport) === -1) {
                            self.airports[airportsIndex].airports.push(airport);
                        }
                    }
                });
            });
        }

        function pickBykey(array, searchKey) {
            var result = {};
            angular.forEach(array, function (value, key) {
                var searchKeyRegexp = new RegExp(searchKey + '_?', 'g');
                if (key.match(searchKeyRegexp)) {
                    var newKey = key.replace(searchKeyRegexp, '');
                    if (newKey.length === 0) {
                        newKey = 'airport';
                    }
                    result[newKey] = value;
                }
            });
            return result;
        }

    }
});