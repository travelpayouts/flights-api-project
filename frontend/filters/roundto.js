/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
export const roundToFilter = () => (input) =>
    parseFloat(input)
        .toFixed(2)
        .replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, '$1 ');
