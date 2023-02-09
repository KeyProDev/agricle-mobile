import { httpService } from '../../services/httpService';
import user from './constants';
import {loadUser} from "../Auth/actions";

export const getProfile = () => (dispatch) => {
    dispatch({
        type: user.SET_LOADING
    });
    httpService.get(`/user`)
        .then(res => {
            dispatch({
                type: user.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: user.SET_USER_PROFILE,
                    payload: res.data.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: user.UNSET_LOADING
            });
        });
};

export const getProducerInfo = (producerId) => (dispatch) => {
    dispatch({
        type: user.SET_LOADING
    });
    httpService.get(`/user/producer/${producerId}`)
        .then(res => {
            dispatch({
                type: user.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: user.SET_PRODUCER_PROFILE,
                    payload: res.data.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: user.UNSET_LOADING
            });
        });
}

export const getWorkerInfo = (workerId) => (dispatch) => {
    dispatch({
        type: user.SET_LOADING
    });
    httpService.get(`/user/worker/${workerId}`)
        .then(res => {
            dispatch({
                type: user.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: user.SET_WORKER_PROFILE,
                    payload: res.data.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: user.UNSET_LOADING
            });
        });
}

export const updateProfile = (userData, navigation) => (dispatch) => {
    httpService.post('/profile/update', userData, true)
        .then(res => {
            dispatch({
                type: user.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: user.UPDATE_PROFILE_SUCCESS,
                    payload: res.data.data
                });
                dispatch(loadUser());
                navigation.navigate('Home');
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: user.UNSET_LOADING
            });
        })
}

export const getFarmers = () => (dispatch) => {
    dispatch({
        type: user.SET_LOADING,
    });
    httpService.get(`/favourite/user`)
        .then(res => {
            dispatch({
                type: user.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: user.SET_FARMERS,
                    payload: res.data.data,
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: user.UNSET_LOADING
            });
        });
}

export const getFarms = () => (dispatch) => {
    dispatch({
        type: user.SET_LOADING,
    });
    httpService.get(`/favourite/recruitment`)
        .then(res => {
            dispatch({
                type: user.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: user.SET_FARMS,
                    payload: res.data.data,
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: user.UNSET_LOADING
            });
        });
}

export const errors = (message, errors={}) => (dispatch) => {
    dispatch({
        type: user.SET_ERRORS,
        payload: {
            message,
            errors
        }
    });
}

