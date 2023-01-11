import {BehaviorSubject} from 'rxjs';
import {getParams, handleJsonResponse} from "../_helpers";
import {Api} from "../_api";

const {appConfig} = window;

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const jwtSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('jwt')));
const authenticatedSubject = new BehaviorSubject(false);

let expirationTimer
let refresh = () => {
    return fetch(`${appConfig.apiUrl}/users/refresh`, getParams())
        .then(handleJsonResponse)
        .then(updateJwt)
        .then(() => setRefreshToken())
}

function setRefreshToken() {
    if (jwtSubject.value && jwtSubject.value.expire) {
        const refreshWithRetry = () => refresh().catch(error => {
            console.error(error)
            if (expirationTimer) clearTimeout(expirationTimer);
            expirationTimer = setTimeout(refreshWithRetry, 5000)
        });

        if (expirationTimer) {
            clearTimeout(expirationTimer);
            expirationTimer = null;
        }
        expirationTimer = setTimeout(refreshWithRetry, new Date(jwtSubject.value.expire) - new Date() - 20_000)
    }
}

setRefreshToken();

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    authHeader: authHeader,
    token,
    authenticated: authenticatedSubject.asObservable(),

    get currentUserValue() {
        return currentUserSubject.value
    },
    isAuthenticated() {
        return authenticatedSubject.value
    },
    checkAndRefresh: refresh,
    updateCurrentUser: updateCurrentUser,
};
updateAuthenticated();

function authHeader() {
    return {"Authorization": "Bearer " + token()}
}

function token() {
    return jwtSubject.value ? jwtSubject.value.token : ""
}

function updateCurrentUser(username) {
    return Api.forUser(username).profile()
        .then(user => new Promise(resolve => {
            localStorage.setItem('currentUser', JSON.stringify(user))
            resolve(user)
        }))
        .then(user => new Promise(resolve => {
            currentUserSubject.next(user)
            resolve(user)
        }))
        .then(user => new Promise(resolve => {
            updateAuthenticated()
            resolve(user)
        }))
}

function login(username, password) {
    const reqOpts = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    };

    return fetch(`${appConfig.apiUrl}/users/authenticate`, reqOpts)
        .then(handleJsonResponse)
        .then(updateJwt)
        .then(()=>updateCurrentUser(username))
}

function updateAuthenticated() {
    authenticatedSubject.next(currentUserSubject.value && !!currentUserSubject.value.username && jwtSubject.value && !!jwtSubject.value.token)
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    jwtSubject.next({})
    currentUserSubject.next({})
    updateAuthenticated()
}

function updateJwt(response) {
    const {token, expire} = response
    localStorage.setItem('jwt', JSON.stringify({token, expire}))
    jwtSubject.next({token, expire})
    updateAuthenticated()

    return {token, expire}
}
