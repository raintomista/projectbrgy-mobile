import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';


export async function getInbox(page, limit, order, skip) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/inbox?page=${page}&limit=${limit}&order=${order}&skip=${skip}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getMessagesById(id, page, limit, order, skip) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/message/${id}?page=${page}&limit=${limit}&order=${order}&skip=${skip}`, {
        headers: {
            'x-access-token': token
        }
    });
}