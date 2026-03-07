export const formatTimeIST = (date) => {
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

export const formatTimeShortIST = (date) => {
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};
