import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function getComments(postId, page, limit, skip) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/comment/${postId}?page=${page}&limit=${limit}&skip=${skip}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function addComment(postId, message) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/comment`,
        method: 'post',
        headers: {
            'x-access-token': token
        },
        data: {
            post_id: postId,
            message: message
        }
    });
}

export async function deleteComment(commentId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/comment/${commentId}`,
        method: 'delete',
        headers: {
            'x-access-token': token
        }
    });
}