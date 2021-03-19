/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
const padTime = (t) => {
    return t < 10 ? `0${t}` : t;
};

export const secondsToTimeFilter = () => (_seconds, format) => {
    if (format === undefined) {
        format = '%hours%h %minutes%m';
    }
    if (typeof _seconds !== 'number' || _seconds < 0) return '00:00:00';
    let hours = Math.floor(_seconds / 3600);
    let minutes = Math.floor((_seconds % 3600) / 60);
    return format
        .replace(/%hours%/, padTime(hours))
        .replace(/%minutes%/, padTime(minutes));
};
