module.exports = angular.module('travelPayoutsApp').component('searchResultsItem', {
    templateUrl: './templates/components/searchResultsItem.html',
    bindings: {
        value: '<',
    },
    require: {
        parent: '^^searchResults'
    },
    controller: function ($element) {
        var self = this;
        var termsLenght = 0;
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
            var result = [];
            angular.forEach(self.value.terms, function (value, id) {
                value.id = id;
                value.label = self.gates[id];
                result.push(value);
            });
            return result;
        };

        function setFligts() {
            var flights = angular.copy(self.value.segment);
            angular.forEach(flights, function (segment, direction) {
                angular.forEach(segment.flight, function (flight, flightKey) {
                    var segmentDirections = self.value.segments_airports[direction];
                    if (flight.departure === segmentDirections[0]) {
                        flights[direction].first = flight;
                    }
                    if (flight.arrival === segmentDirections[1]) {
                        flights[direction].last = flight;
                    }

                });

            });
            return flights;
        };

    }
}).filter('secondsToTime', function () {

    function padTime(t) {
        return t < 10 ? "0" + t : t;
    }

    return function (_seconds, format) {
        if (format === undefined) {
            format = '%hours%h %minutes%m';
        }
        if (typeof _seconds !== "number" || _seconds < 0)
            return "00:00:00";
        var hours = Math.floor(_seconds / 3600),
            minutes = Math.floor((_seconds % 3600) / 60);
        return format.replace(/%hours%/, padTime(hours)).replace(/%minutes%/, padTime(minutes));
    };
});
