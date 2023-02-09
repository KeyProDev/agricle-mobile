import { httpService } from '../../services/httpService';
import matter from './constants';
import {showMessage} from "react-native-flash-message";

export const getMatters = (skip=0, limit=10, conditions={}) => (dispatch) => {
    dispatch({
        type: matter.SET_LOADING,
    });
    httpService.post(`/matters`, {skip, limit, conditions})
        .then(res => {
            if(res.data.success) {
                if(skip === 0) {
                    dispatch({
                        type: matter.SET_MATTERS,
                        payload: res.data.data,
                    });
                }
                else {
                    dispatch({
                        type: matter.ADD_MATTERS,
                        payload: res.data.data,
                    });
                }
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: matter.UNSET_LOADING,
            });
            console.log("getAllError:", err)
        });
}

export const getRecentMatters = () => (dispatch) => {
    dispatch({
        type: matter.SET_LOADING,
    });
    httpService.get('/matters/recent')
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: matter.SET_RECENT_MATTERS,
                    payload: res.data.data
                });
            }
            else {
                dispatch({
                    type: matter.UNSET_LOADING
                })
            }
        })
        .catch(err => {
            dispatch({
                type: matter.UNSET_LOADING
            })
        })
}

export const setMatter = (matterId) => (dispatch) => {
    dispatch({
        type: matter.SET_MATTER,
        payload: {matterId}
    });
}

export const apply = (matterId, applyMemo, successAction, errorAction) => (dispatch) => {
    dispatch({
        type: matter.SET_LOADING,
    });
    httpService.put('/matter/apply', { matterId, applyMemo })
        .then(res => {
            dispatch({
                type: matter.UNSET_LOADING,
            });
            if(res.data.success) {
                successAction();
            }
            else {
                errorAction();
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            console.log("applyError:", err);
            errorAction();
        });
}

export const getFavouriteMatters = (skip=0, limit=10) => (dispatch) => {
    dispatch({
        type: matter.SET_LOADING,
    });
    httpService.post(`/matters/favourite`, {skip, limit})
        .then(res => {
            if(res.data.success) {
                if(skip === 0) {
                    dispatch({
                        type: matter.SET_FAVOURITE_MATTERS,
                        payload: res.data.data,
                    });
                }
                else {
                    dispatch({
                        type: matter.ADD_FAVOURITE_MATTERS,
                        payload: res.data.data,
                    });
                }
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: matter.UNSET_LOADING,
            });
            console.log("getAllError:", err)
        });
}

export const setFavourite = (matterId) => (dispatch) => {
    dispatch({
        type: matter.SET_LOADING
    });
    httpService.put('/matter/favourite', { matterId })
        .then(res => {
            console.log(res);
            dispatch({
                type: matter.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: matter.SET_FAVOURITE,
                    payload: {
                        matterId,
                        is_favourite: res.data.data
                    }
                })
            }
        })
}

export const removeFavourite = (matterId) => (dispatch) => {
    dispatch({
        type: matter.REMOVE_FAVOURITE_MATTER,
        payload: matterId
    })
}

export const errors = (message, errors={}) => (dispatch) => {
    dispatch({
        type: matter.SET_ERRORS,
        payload: {
            message,
            errors
        }
    });
}

