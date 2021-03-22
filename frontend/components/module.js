/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {module} from 'angular';
import {APP_PREFIX} from '../constants';
import {searchResultsItemComponent} from './searchResultsItemComponent';
import {
    searchFilterPanelComponent,
    searchResultsFilterComponent,
} from './searchResultsFilterComponent';
import {searchResultsComponent} from './searchResultsComponent';
import {priceComponent} from './priceComponent';
import {preloaderComponent} from './preloaderComponent';
import {flightLineComponent} from './flightLineComponent';
import {expireResultsComponent} from './expireResultsComponent';

export const componentsModule = module(`${APP_PREFIX}.components`, [])
    .component('expireResults', expireResultsComponent)
    .component('flightLine', flightLineComponent)
    .component('preloader', preloaderComponent)
    .component('priceComponent', priceComponent)
    .component('searchResults', searchResultsComponent)
    .component('searchResultsFilter', searchResultsFilterComponent)
    .component('searchResultsItem', searchResultsItemComponent)
    .component('searchFilterPanel', searchFilterPanelComponent).name;
