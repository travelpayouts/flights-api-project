module.exports = angular.module('travelPayoutsApp').component('preloader', {
    templateUrl: './templates/components/preloader.html',
    bindings: {
        progress: '<'
    },
    controller: function ($element) {
        var self = this;
        self.wrapper = $element.find('.wrapper');
        self.progressBar = $element.find('.load__ok');
        self.$onChanges = function () {
            if (self.progress > 100) {
                self.progress = 100;
            }
            $(self.progressBar[0]).css({
                width: (self.wrapper[0].clientWidth * (self.progress / 100)) - 90 + 'px'
            });
        }
    }
});