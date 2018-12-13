require('@uirouter/angularjs');
require('angular-dynamic-locale');
require('ng-slide-down');
require('@iamadamjowett/angular-click-outside');

require('./scss/app.scss');

var app = angular.module('travelPayoutsApp', [
    require('angular-sanitize'),
    require('angular-animate'),
    'mgcrea.ngStrap.core',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.popover',
    'ui.router',
    require('tp-ng-search'),
    'tmh.dynamicLocale',
    require('angular-ui-notification'),
    'ng-slide-down',
    require('angularjs-slider'),
    'angular-click-outside'
]).run(function (tmhDynamicLocale, tmhDynamicLocaleCache) {
    function getInjectedLocale() {
        var localInjector = angular.injector(['ngLocale']);
        return localInjector.get('$locale');
    }

    require('angular-i18n/angular-locale_ru');
    tmhDynamicLocaleCache.put('ru', getInjectedLocale());
    require('angular-i18n/angular-locale_en');
    tmhDynamicLocaleCache.put('en', getInjectedLocale());
}).config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.defaultLocale('en');
}).run(
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });

function requireAll(r) {
    r.keys().forEach(r);
}

requireAll(require.context('./components/', true, /\.js$/));
requireAll(require.context('./controllers/', true, /\.js$/));

require.ensure(['./controllers/indexController'], function () {
    angular.bootstrap(document, ['travelPayoutsApp']);
    //Hide preloader and show app
    $(document).find('body').removeClass('loaded').addClass('web');
});

module.exports = app;