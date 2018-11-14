import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function getBrgyById(brgyId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/barangay/${brgyId}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getBrgyFollowingList(brgyId, page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/following/pages/${brgyId}?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getBrgyFollowersList(brgyId, page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/followers/${brgyId}?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getBrgyPagePosts(brgyId, page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/post/barangay/${brgyId}?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getBrgyPageSharedPosts(brgyId, page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/shared/post/page/${brgyId}?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}


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


export async function getResidents(brgyId) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/barangay/${brgyId}/residents`, {
        headers: {
            'x-access-token': token
        }
    });
}
