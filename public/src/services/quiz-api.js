import store from './store.js';
// import { pathToFileURL } from 'url';
const URL = '/api';

const userToken = store.getToken();

if (!userToken && location.pathname !== '/auth.html') {
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    location = `auth.html?${searchParams.toString()}`;
}

function fetchWithError(url, options) {
    if (userToken) {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Authorization = userToken;
    }

    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                return response.json().then(json => {
                    throw json.error;
                });
            }
        });
}

export function getAllTimeData() {
    const url = '/data/game';
    return fetchWithError(url);
}

export function getMBTI(name) {
    const url = `${URL}/mbti/${name}`;
    return fetchWithError(url);
}

export function getGames() {
    const url = `${URL}/game`;
    return fetchWithError(url);
}

export function getQuestion(id) {
    const url = `${URL}/test`;
    return fetchWithError(url)
        .then(test => {
            return test.find(test => {
                return test.id === id;
            });
        });
}

export function getAnswers(id) {
    const url = `${URL}/answers`;
    return fetchWithError(url)
        .then(answers => {
            return answers.filter(answer => {
                return answer.question_id === id;
            });
        });
}


export function updateGame(data) {
    const url = `${URL}/game/${data.id}`;
    return fetchWithError(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

export function backOne(data) {
    const url = `${URL}/game/${data.id}`;
    return fetchWithError(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

}

export function createGame(order) {
    const url = `${URL}/game/`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    });
}

export function getCharacterFromApi(name) {
    const url = `https://rickandmortyapi.com/api/character/?name=${name}`;
    return fetch(url)
        .then(response => response.json());
}

// don't make functions do double-duty, these are different methods, different routes, different data!
export function getCharacter(mbti) {
    const url = `${URL}/characters/${mbti}`;
    return fetchWithError(url);
}

export function getAllCharacters() {   
    const url = 'data/characters';
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
