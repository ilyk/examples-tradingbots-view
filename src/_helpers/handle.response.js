import {authenticationService} from "../_services";

export async function handleJsonResponse(response) {
    await checkResponse(response)

    return response.json()
}

async function checkResponse(response) {
    if (typeof response.status !== 'undefined' && response.status / 100 >= 3) {
        console.log("response code not 2xx")
        let errorMessage = response.statusText
        try {
            let json = await response.json()
            if (typeof json.message !== 'undefined') {
                errorMessage = json.message
            }
        } catch (e) {
        }

        throw errorMessage
    }
}

export async function handleEmptyResponse(response) {
    await checkResponse(response)

    return ""
}

export function handleError(component) {
    return error => {
        console.log(error)
        if (typeof error.message !== 'undefined') {
            error = error.message
        }

        if (error === 'Failed to fetch') {
            error = 'Cannot connect to the server :('
        }

        if (component !== undefined && typeof component.setState === 'function') {
            component.setState({errorMessage: 'Error: ' + error})
        }
        console.error(error)
    }
}

export function getParams() {
    const reqOpts = {
        method: 'GET',
        headers: authenticationService ? authenticationService.authHeader() : {},
    };
    reqOpts.headers['Content-Type'] = 'application/json'

    return reqOpts
}

// noinspection JSUnusedGlobalSymbols
export function postParams(params) {
    const reqOpts = getParams()
    reqOpts.method = 'POST'
    reqOpts.body = JSON.stringify(params)

    return reqOpts
}

export function putParams(params) {
    const reqOpts = getParams()
    reqOpts.method = 'PUT'
    reqOpts.body = JSON.stringify(params)

    return reqOpts
}

export function deleteParams() {
    const reqOpts = getParams()
    reqOpts.method = 'DElETE'

    return reqOpts
}
