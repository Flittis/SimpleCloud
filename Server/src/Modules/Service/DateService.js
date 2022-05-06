let DateService = {
    changeTimezone: (Now, TZ = 'Europe/Moscow') => {
        return new Date(Now.toLocaleString("en-US", { timeZone: TZ }));
    },
    parseDate: (Now) => {
        if (typeof Now == 'date') return Now;
        else if (typeof Now == 'string' || typeof Now == 'number') return new Date(Now);
        else return new Date();
    },
    startOfDay: (Now) => {
        Now = this.parseDate(Now);

        return new Date(Now.getFullYear(), Now.getMonth(), Now.getDate(), 0, 0, 0);
    },
    endOfDay: (Now) => {
        Now = this.parseDate(Now);

        return new Date(Now.getFullYear(), Now.getMonth(), Now.getDate(), 23, 59, 59);
    },
}

export default DateService;