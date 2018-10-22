import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function followBrgy(brgyId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.post(`${API_HOST}/follow/${brgyId}`, null, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function unfollowBrgy(brgyId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.delete(`${API_HOST}/unfollow/${brgyId}`, {
        headers: {
            'x-access-token': token
        }
    });
}