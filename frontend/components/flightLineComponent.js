import findIndex from 'lodash/findIndex';

export const flightLineComponent = {
    templateUrl: './templates/components/flightLine.html',

    bindings: {
        flights: '<',
        first: '<',
        last: '<',
    },

    require: {
        parent: '^^searchResultsItem',
    },

    controller: /* @ngInject */ function ($element) {
        let self = this;
        self.airports = [];
        self.cities = [];
        let directions = ['departure', 'arrival'];
        let originDep = {};
        self.travelDirection = {
            departure: 'Departure from',
            arrival: 'Arrival to',
            change: 'Change airport to',
        };

        self.$onChanges = function () {
            self.airportsData = self.parent.airports;
            originDep[self.first] = 'first';
            originDep[self.last] = 'last';
            setAirportsData();
        };

        function setAirportsData() {
            angular.forEach(self.flights, (flight) => {
                angular.forEach(directions, (direction) => {
                    let airportValues = pickBykey(flight, direction);
                    let airport = airportValues.airport;
                    let city = self.airportsData[airport].city_code;
                    airportValues.direction = direction;

                    let airportsIndex = findIndex(self.airports, {city});
                    if (airportsIndex === -1) {
                        let data = {
                            city,
                            status:
                                originDep[airport] !== undefined
                                    ? originDep[airport]
                                    : '',
                            data: [airportValues],
                            airports: [airport],
                        };
                        self.airports.push(data);
                    } else {
                        self.airports[airportsIndex].data.push(airportValues);
                        if (
                            self.airports[airportsIndex].airports.indexOf(
                                airport,
                            ) === -1
                        ) {
                            self.airports[airportsIndex].airports.push(airport);
                        }
                    }
                });
            });
        }

        function pickBykey(array, searchKey) {
            let result = {};
            angular.forEach(array, (value, key) => {
                let searchKeyRegexp = new RegExp(`${searchKey}_?`, 'g');
                if (key.match(searchKeyRegexp)) {
                    let newKey = key.replace(searchKeyRegexp, '');
                    if (newKey.length === 0) {
                        newKey = 'airport';
                    }
                    result[newKey] = value;
                }
            });
            return result;
        }
    },
};
