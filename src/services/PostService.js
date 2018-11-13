import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function likePost(postId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/like/${postId}`,
        method: 'post',
        headers: {
            'x-access-token': token
        }
    });
}

export async function unlikePost(postId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/unlike/${postId}`,
        method: 'delete',
        headers: {
            'x-access-token': token
        }
    });
}

export async function sharePost(postId, caption) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/share/${postId}`,
        method: 'post',
        headers: {
            'x-access-token': token
        },
        data: {
            caption: caption
        }
    });
}

export async function createPost(formData) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/post`,
        method: 'post',
        headers: {
            'x-access-token': token,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    });
}

export async function deletePost(postId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/post/${postId}`,
        method: 'delete',
        headers: {
            'x-access-token': token
        }
    });
}