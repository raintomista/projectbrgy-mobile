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

export function getRegions(generate) {
    return axios.post(`${API_HOST}/barangay/regions?generate=${generate}`);
}

export function getProvinces(region, generate) {
    return axios.post(`${API_HOST}/barangay/provinces?generate=${generate}`, {
        region
    });
}

export function getMunicipalities(region, province, generate) {
    return axios.post(`${API_HOST}/barangay/municipalities?generate=${generate}`, {
        region,
        province
    });
}


export function getBarangays(region, province, municipality, generate) {
    return axios.post(`${API_HOST}/barangay/barangays?generate=${generate}`, {
        region,
        province,
        municipality
    });
}

export function getBarangayDetails(region, province, municipality, name) {
    return axios.post(`${API_HOST}/barangay/detail`, {
        region,
        province,
        municipality,
        name
    });
}

export function createUser(user) {
    return axios.post(`${API_HOST}/users`, user);
}
