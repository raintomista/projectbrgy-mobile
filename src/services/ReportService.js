import axios from 'axios';
import { AsyncStorage } from 'react-native';
import API_HOST from '../config';

export async function getMyReports(page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/inquiry/my-reports?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function createReport(data) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/inquiry`,
        method: 'post',
        headers: {
            'x-access-token': token,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        data: data
    });
}

export async function getMyRespondedReports(page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/inquiry/my-reports/responded?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getReportById(id) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/inquiry/${id}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getReportResponses(id, page, limit, order, skip) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/inquiry/response/${id}?page=${page}&limit=${limit}&order=${order}&skip=${skip}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function getBrgyReports(page, limit, order) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios.get(`${API_HOST}/inquiry?page=${page}&limit=${limit}&order=${order}`, {
        headers: {
            'x-access-token': token
        }
    });
}

export async function addResponse(reportId, formData) {
    const token = await AsyncStorage.getItem('x-access-token');
    return axios({
        url: `${API_HOST}/inquiry/respond/${reportId}`,
        method: 'post',
        headers: {
            'x-access-token': token,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    });
}
