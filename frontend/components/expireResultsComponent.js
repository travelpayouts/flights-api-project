module.exports = angular.module('travelPayoutsApp').component('expireResults', {
    templateUrl: './templates/components/expireResults.html',

    controller: function ($document, $timeout, $state) {
        var self = this;

        self.showWindow = false;
        self.$onInit = function () {
            // Display modal window after 15 minutes of making request
            self.showWindowPromise = $timeout(function () {
                // add modal overlay
                angular.element($document[0].body).addClass('expireResults-show').append('<div class="expireResults-overlay"></div>');
                self.showWindow = true;
            }, 1000 * 900)
        };

        self.$onDestroy = function () {
            $timeout.cancel(self.showWindowPromise);
            // remove modal overlay
            angular.element($document[0].body).removeClass('expireResults-show').find('.expireResults-overlay').remove();
        };

        self.refreshResults = function () {
            $state.reload();
        }
    }


});