export const preloaderComponent = {
    templateUrl: './templates/components/preloader.html',
    bindings: {
        progress: '<',
    },
    controller: /* @ngInject */ function ($element) {
        this.wrapper = $element.find('.wrapper');
        this.progressBar = $element.find('.load__ok');
        this.$onChanges = () => {
            if (this.progress > 100) {
                this.progress = 100;
            }
            $(this.progressBar[0]).css({
                width: `${
                    this.wrapper[0].clientWidth * (this.progress / 100) - 90
                }px`,
            });
        };
    },
};
