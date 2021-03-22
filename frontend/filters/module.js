/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {module} from 'angular';
import {roundToFilter} from './roundto';
import {inArrayFilter} from './inArray';
import {secondsToTimeFilter} from './secondsToTime';
import {APP_PREFIX} from '../constants';

export const filtersModule = module(`${APP_PREFIX}.filters`, [])
    .filter('roundto', roundToFilter)
    .filter('inArray', inArrayFilter)
    .filter('secondsToTime', secondsToTimeFilter).name;
