/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {module} from 'angular';
import {APP_PREFIX} from '../constants';
import {currencyFactory} from './currencyFactory';

export const factoriesModule = module(`${APP_PREFIX}.factory`, []).factory(
    'currencyFactory',
    currencyFactory,
).name;
