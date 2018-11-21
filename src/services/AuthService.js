import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export function loginUser(email, password) {
    return axios.post(`${API_HOST}/auth/sign-in`, {
        email,
        password
    });
}

export async function getUserDetails() {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/me`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function forgotPassword(email) {
    return axios({
        url: `${API_HOST}/auth/forgot-password`,
        method: 'post',
        data: {
            email
        }
    });
}