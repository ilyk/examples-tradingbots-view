export const priority = {
    Emergency: 0,
    Alert: 1,
    Critical: 2,
    Error: 3,
    Warning: 4,
    Notice: 5,
    Info: 6,
    Debug: 7,

    all() {
        return [
            priority.Emergency,
            priority.Alert,
            priority.Critical,
            priority.Error,
            priority.Warning,
            priority.Notice,
            priority.Info,
            priority.Debug,
        ]
    },

    getName(level) {
        return [
            "Emergency",
            "Alert",
            "Critical",
            "Error",
            "Warning",
            "Notice",
            "Info",
            "Debug",
        ][level]
    }
}
