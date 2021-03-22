/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
export const inArrayFilter = ($filter) => (list, arrayFilter, element) => {
    if (arrayFilter) {
        return $filter('filter')(
            list,
            (listItem) => arrayFilter.indexOf(listItem[element]) !== -1,
        );
    }
};
