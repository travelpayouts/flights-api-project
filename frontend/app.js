import 'ng-slide-down';
import '@iamadamjowett/angular-click-outside';
import './scss/app.scss';
import {module} from 'angular';
import angularSanitize from 'angular-sanitize';
import angularAnimate from 'angular-animate';
import angularDynamicLocale from 'angular-dynamic-locale';
import uiRouter from '@uirouter/angularjs';
import {filtersModule} from './filters/module';
import {routerConfig} from './components/router';
import {APP_PREFIX} from './constants';
import {componentsModule} from './components/module';
import {factoriesModule} from './factory/module';
import angularStrap from 'angular-strap';
import tpNgSearch from 'tp-ng-search';
import angularUiNotification from 'angular-ui-notification';
import angularjsSlider from 'angularjs-slider';

const app = module(APP_PREFIX, [
    angularSanitize,
    angularAnimate,
    tpNgSearch,
    angularUiNotification,
    angularjsSlider,
    angularStrap,
    'mgcrea.ngStrap.core',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.popover',
    uiRouter,
    angularDynamicLocale,
    'ng-slide-down',
    'angular-click-outside',
    filtersModule,
    factoriesModule,
    componentsModule,
])
    .config(routerConfig)
    .run(
        /* @ngInject */ (tmhDynamicLocale, tmhDynamicLocaleCache) => {
            const resolveLocale = () =>
                angular.injector(['ngLocale']).get('$locale');
            require('angular-i18n/angular-locale_ru');
            tmhDynamicLocaleCache.put('ru', resolveLocale());
            require('angular-i18n/angular-locale_en');
            tmhDynamicLocaleCache.put('en', resolveLocale());
        },
    )
    .config(
        /* @ngInject */ (tmhDynamicLocaleProvider) => {
            tmhDynamicLocaleProvider.defaultLocale('en');
        },
    )
    .run(
        /* @ngInject */ ($rootScope, $state, $stateParams) => {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        },
    )
    .run(() => {
        //Hide preloader and show app
        const bodyClassList = document.body.classList;
        bodyClassList.remove('loaded');
        bodyClassList.add('web');
    }).name;

angular.bootstrap(document, [app]);
