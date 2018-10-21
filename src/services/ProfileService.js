import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function getFollowingList(userId, page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/following/users/${userId}?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}