import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    likeUser,
    followUser,
    getUserDetails,
    delete: _delete
};

function login(email, password) {
    return fetchWrapper.post(`http://localhost:3030/api/user/login`, { email, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

function register(user) { 
    return fetchWrapper.post(`http://localhost:3030/api/user/addUser`, user);
}

function getAll() {
    return fetchWrapper.get("http://localhost:3030/api/network/getAllUsers");
}

function getById(user_id) {
    return fetchWrapper.get(`http://localhost:3030/api/network/getUserById?user_id=${user_id}`);
}

function likeUser(content_id, user_id) {
    
    const params = {content_id:content_id,user_id:user_id}
    return fetchWrapper.post(`http://localhost:3030/api/network/like/`, params)
        .then(x => {
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));
                userSubject.next(user);
            return x;
        });
}

function followUser(profile_id, follower_id) {
    
    const params = {profile_id:profile_id,follower_id:follower_id}
    return fetchWrapper.post(`http://localhost:3030/api/network/follow`, params)
        .then(x => {
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));
                userSubject.next(user);
            return x;
        });
}

function getUserDetails(userId) {
    return fetchWrapper.get(`http://localhost:3030/api/network/getUserDetails?profile_id=${userId}`);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
