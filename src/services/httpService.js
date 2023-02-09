import axios from 'axios';
import * as storageService from './storageService';
export const httpService = {
    get,
    post,
    put,
    deleteDetail
};
import {serverURL} from '../constants/config';

const baseUrl = serverURL+'api/v1';

function get(apiEndpoint, token)
{
    token = storageService.getStorage('token');
    return axios.get(baseUrl + apiEndpoint, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    }).then((response) =>
    {
        return response;
    }).catch((err) =>
    {
        return err.response;
    })
}

function post(apiEndpoint, payload, form)
{
    const token = storageService.getStorage('token');
    var formheader = {
        'authorization': `Bearer ${token}`,
    }
    if (form)
    {
        formheader = {
            // 'recaptcha-token': token,
            'authorization': `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    }
    return axios.post(baseUrl + apiEndpoint, payload, {
        headers: formheader,
        timeout: 10000,
    }).then((response) =>
    {
        return response;
    }).catch((err) =>
    {
        return err.response;
    })
}
function put(apiEndpoint, payload, form)
{
    const token = storageService.getStorage('token');
    var formheader = {
        'authorization': `Bearer ${token}`,
    }
    if (form)
    {
        formheader = {
            // 'recaptcha-token': token,
            'authorization': `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    }
    return axios.put(baseUrl + apiEndpoint, payload, {
        headers: formheader
    }).then((response) =>
    {
        return response;
    }).catch((err) =>
    {
        return err.response;
    })
}
function deleteDetail(apiEndpoint, token)
{
    token = storageService.getStorage('token');
    return axios.delete(baseUrl + apiEndpoint, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    }).then((response) =>
    {
        return response;
    }).catch((err) =>
    {
        return err.response;
    })
}
