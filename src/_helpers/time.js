import dateFormat from "date-fns/format";
import parseDate from "date-fns/parse";

const Nanosecond = 1
const Microsecond = 1000 * Nanosecond
const Millisecond = 1000 * Microsecond
const Second = 1000 * Millisecond
const Minute = 60 * Second
const Hour = 60 * Minute

export const time = {
    Nanosecond: Nanosecond,
    Microsecond: Microsecond,
    Millisecond: Millisecond,
    Second: Second,
    Minute: Minute,
    Hour: Hour,

    DurationToString: function (duration: number): string {
        const nanoseconds = parseInt(duration % 1000)
            , microseconds = parseInt(duration / Microsecond % 1000)
            , milliseconds = parseInt(duration / Millisecond % 1000)
            , seconds = parseInt((duration / Second) % 60)
            , minutes = parseInt((duration / Minute) % 60)
            , hours = parseInt((duration / Hour) % 24);

        let str = "";

        if (nanoseconds > 0) {
            str = nanoseconds + "µ"
        }
        if (microseconds > 0) {
            str = microseconds + "n " + str
        }
        if (milliseconds > 0) {
            str = milliseconds + "ms " + str
        }
        if (seconds > 0) {
            str = seconds + "s " + str
        }
        if (minutes > 0) {
            str = minutes + "m " + str
        }
        if (hours > 0) {
            str = hours + "h " + str
        }

        if (str === "") {
            str = "0s"
        }

        return str;
    },
    StringToDuration: function (stringDuration: string): number {
        let duration = 0;
        let str = String(stringDuration)

        const hours = str.match(/(\d+)\s*h/);
        const minutes = str.match(/(\d+)\s*m($|\W)/);
        const seconds = str.match(/(\d+)\s*s/);
        const milliseconds = str.match(/(\d+)\s*ms/);
        const microseconds = str.match(/(\d+)\s*n/);
        const nanoseconds = str.match(/(\d+)\s*µ/);

        if (hours) {
            duration += parseInt(hours[1]) * Hour;
        }
        if (minutes) {
            duration += parseInt(minutes[1]) * Minute;
        }
        if (seconds) {
            duration += parseInt(seconds[1]) * Second;
        }
        if (milliseconds) {
            duration += parseInt(milliseconds[1]) * Millisecond;
        }
        if (microseconds) {
            duration += parseInt(microseconds[1]) * Microsecond;
        }
        if (nanoseconds) {
            duration += parseInt(nanoseconds[1]);
        }

        return duration;
    },

    parseString: (dateString, format) => {
        return parseDate(dateString, format, new Date())
    },

    formatFromString: (value, format) => {
        try {return dateFormat(new Date(value), format);}
        catch {return ""}
    },

    formatUtcFromString: (value, format) => {
        try {return dateFormat(time.getUTCDate(value), format);}
        catch {return ""}
    },

    getUTCDate: (dateString = Date.now()) => {
        try {
            const date = new Date(dateString);

            return new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
            );
        } catch {return new Date()}
    },
    getLocalDate: (dateString = Date.now()) => {
        try {
            const date = new Date(dateString);

            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes() - date.getTimezoneOffset(),
                date.getSeconds(),
            );
        } catch {return new Date()}
    },
}
