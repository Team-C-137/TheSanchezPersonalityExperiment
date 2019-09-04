const URL = '/api';
import store from './store.js';

const userToken = store.getToken();

if(!userToken && location.pathname !== '/auth.html') {
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    location = `auth.html?${searchParams.toString()}`;
}
function fetchWithError(url, options) {
    if(userToken) {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Authorization = userToken;
    }

    return fetch(url, options)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            else {
                return response.json().then(json => {
                    throw json.error;
                });
            }
        });
}

export function makeNewGame(userId) {
    const url = `${URL}/game`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userId)
    });
}

export function getGames() {
    const url = `${URL}/game`;
    return fetchWithError(url);
}







//copy paste from Marty

export function userSignUp(user) {
    const url = `${URL}/auth/signup`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
}

export function userSignIn(credentials) {
    const url = `${URL}/auth/signin`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
}