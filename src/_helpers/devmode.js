export function isDevMode() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
}