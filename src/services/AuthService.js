import axios from 'axios';
import API_HOST from '../config';

export function loginUser(email, password) {
    return axios.post(`${API_HOST}/auth/sign-in`, {
        email,
        password
    });
}