export const searchResultsItemComponent = {
    templateUrl: './templates/components/searchResultsItem.html',
    bindings: {
        value: '<',
    },
    require: {
        parent: '^^searchResults',
    },
    controller: /* @ngInject */ function ($element) {
        let self = this;
        let termsLenght = 0;
        self.isRetina = window.devicePixelRatio > 1;
        self.$onChanges = function () {
            self.gates = self.parent.gates;
            self.airports = self.parent.airports;
            self.searchId = self.parent.searchId;
            self.fligth = setFligts();
        };

        self.$doCheck = function () {
            if (Object.keys(self.value.terms).length !== termsLenght) {
                termsLenght = Object.keys(self.value.terms).length;
                self.prices = setPrices();
            }
        };

        function setPrices() {
            let result = [];
            angular.forEach(self.value.terms, (value, id) => {
                value.id = id;
                value.label = self.gates[id];
                result.push(value);
            });
            return result;
        }

        function setFligts() {
            let flights = angular.copy(self.value.segment);
            angular.forEach(flights, (segment, direction) => {
                angular.forEach(segment.flight, (flight, flightKey) => {
                    let segmentDirections =
                        self.value.segments_airports[direction];
                    if (flight.departure === segmentDirections[0]) {
                        flights[direction].first = flight;
                    }
                    if (flight.arrival === segmentDirections[1]) {
                        flights[direction].last = flight;
                    }
                });
            });
            return flights;
        }
    },
};
