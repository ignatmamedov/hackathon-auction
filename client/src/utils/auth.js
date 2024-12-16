import { writable } from 'svelte/store';
import { URL } from './utils.js';

const token = localStorage.getItem('token');
let initialUser = null;

if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        initialUser = payload;
    } catch (error) {
        console.error('Invalid token, logging out.', error);
        logout();
    }
}

export const isLoggedIn = writable(Boolean(initialUser));
export const user = writable(initialUser);

/**
 * Logs the user out by removing the token from localStorage and updating state.
 */
export const logout = () => {
    localStorage.removeItem('token');
    isLoggedIn.set(false);
    user.set(null);
};

/**
 * Logs the user in by storing the token and updating the user's state.
 * @param {string} token - The JWT token to store and extract user information from.
 */
export const login = (token) => {
    try {
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        user.set(payload);
        isLoggedIn.set(true);
    } catch (error) {
        console.error('Failed to login, invalid token.', error);
        logout();
    }
};

/**
 * Registers a new user by sending a request to the server.
 * @async
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @throws {Error} Throws an error if registration fails.
 */
export const register = async (email, password) => {
    try {
        const response = await fetch(`${URL}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Registration failed');
        }

        login(result.token);
    } catch (error) {
        throw new Error(error.message);
    }
};
