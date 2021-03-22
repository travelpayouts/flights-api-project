import findIndex from 'lodash/findIndex';

export const currencyFactory = () => {
    let currency = {
        list: [
            {id: 'usd', label: 'US dollar', sign: '$', view: 'start'},
            {id: 'eur', label: 'Euro', sign: '€', view: 'end'},
            {id: 'rub', label: 'Ruble', sign: '&#8381;', view: 'end'},
        ],

        rate: {},
        value: '',
    };

    return {
        getLabels: () => currency.list,

        get() {
            let list = currency.list;
            let fieldIndex = findIndex(list, {id: currency.value});
            if (fieldIndex !== -1) {
                return list[fieldIndex];
            }
            return false;
        },

        set(id) {
            let list = currency.list;
            if (findIndex(list, {id}) !== -1) {
                currency.value = id;
                return true;
            }
            return false;
        },

        setData(data) {
            currency.rate = data;
        },

        getData: () => currency.rate,
    };
};
