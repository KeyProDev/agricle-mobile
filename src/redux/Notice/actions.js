import notice from "../Notice/constants";
import {httpService} from "../../services/httpService";

export const getAll = () => (dispatch) => {
    dispatch({
        type: notice.SET_LOADING
    });
    httpService.get('/notice/all')
        .then(res => {
            dispatch({
                type: notice.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: notice.SET_NOTICES,
                    payload: res.data.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: notice.UNSET_LOADING
            });
        });
}

export const getUnreadNotices = () => (dispatch) => {
    dispatch({
        type: notice.SET_LOADING
    });
    httpService.get('/notice/unread')
        .then(res => {
            dispatch({
                type: notice.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: notice.SET_UNREAD_NOTICES,
                    payload: res.data.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: notice.UNSET_LOADING
            });
        });
}

export const readNews = (newsId) => (dispatch) => {
    httpService.put('/notice/read', {newsId})
        .then(res => {
            dispatch({
                type: notice.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: notice.SET_READ_NEWS,
                    payload: newsId
                })
            }
        })
        .catch(err => {
            dispatch({
                type: notice.UNSET_LOADING
            });
        })
}

export const addUnreadNews = (data) => (dispatch) => {
    dispatch({
        type: notice.ADD_UNREAD_NOTICE,
        payload: data
    })
}

export const deleteNews = (idArray) => (dispatch) => {
    dispatch({
        type: notice.SET_LOADING
    });
    httpService.post('/notice/delete', {idArray})
        .then(res => {
            dispatch({
                type: notice.UNSET_LOADING
            });
            if (res.data.success) {
                dispatch({
                    type: notice.DELETE_NEWS_SUCCESS,
                    payload: idArray
                });
            }
        })
        .catch(err => {
            dispatch({
                type: notice.UNSET_LOADING
            });
            console.log('delete multi news error', err);
        })
}

export const errors = (message, errors={}) => (dispatch) => {
    dispatch({
        type: notice.SET_ERRORS,
        payload: {
            message,
            errors
        }
    });
}
