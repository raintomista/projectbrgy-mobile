import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function search(searchQuery, page, limit) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/barangay?search=${searchQuery}&page=${page}&limit=${limit}`, {
        headers: {
            'x-access-token': token
        }
    });
}