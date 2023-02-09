import {httpService} from "../../services/httpService";
import chat from './constants';

export const getRecruitments = () => (dispatch) => {
    dispatch({
        type: chat.SET_LOADING
    });
    httpService.get('/chat/recruitments')
        .then(res => {
            dispatch({
                type: chat.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: chat.SET_RECRUITMENTS,
                    payload: res.data.data
                })
            }
            else {
                dispatch({
                    type: chat.UNSET_LOADING
                });
                dispatch(errors(res.data.message, res.data.data));
            }
        })
};

export const getFavourites = () => (dispatch) => {
    httpService.get('/chat/favourites')
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: chat.SET_FAVOURITES,
                    payload: res.data.data,
                })
            }
        })
}

export const setRecruitment = (recruitment) => (dispatch) => {
    dispatch({
        type: chat.SET_RECRUITMENT,
        payload: recruitment
    })
}

export const getApplicants = (recruitmentId, successAction) => (dispatch) => {
    httpService.get(`/chat/applicants/${recruitmentId}`)
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: chat.SET_APPLICANTS,
                    payload: res.data.data
                });
                successAction();
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
}

export const enterChatting = (receiverId, recruitmentId, navigateAction) => (dispatch) => {
    httpService.get(`/chat/info/${recruitmentId}/${receiverId}`)
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: chat.SET_CHATTING,
                    payload: res.data.data
                });
                navigateAction()
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
}

export const getMessages = (skip=0, limit=10, sender_id, recruitment_id) => (dispatch) => {
    dispatch({
        type: chat.SET_LOADING
    });
    httpService.post('/chat/messages', { skip, limit, sender_id, recruitment_id })
        .then((res) => {
            dispatch({
                type: chat.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: skip===0 ? chat.SET_MESSAGES : chat.ADD_MESSAGES,
                    payload: res.data.data
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
}

export const getUnreadMessages = () => (dispatch) => {
    httpService.get('/chat/unread')
        .then(res => {
            dispatch({
                type: chat.UNSET_LOADING
            })
            if(res.data.success) {
                dispatch({
                    type: chat.SET_UNREAD_MESSAGES,
                    payload: res.data.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: chat.UNSET_LOADING
            })
        })
}

export const addUnreadMessage = (message) => (dispatch) => {
    dispatch({
        type: chat.ADD_UNREAD_MESSAGE,
        payload: message
    });
}

export const removeMessages = (recruitment_id, receiver_id) => (dispatch) => {
    httpService.deleteDetail(`/chat/${recruitment_id}/${receiver_id}`)
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: chat.SET_MESSAGES,
                    payload: []
                })
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
}

export const send = (data) => (dispatch) => {
    dispatch({
        type: chat.ADD_MESSAGES,
        payload: [data]
    });
    httpService.post('/chat/send', data)
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: chat.SEND_SUCCESS,
                    payload: res.data.data
                })
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => console.log('message send error:', err))
}

export const receive = (data) => (dispatch) => {
    httpService.put('/chat/read', data)
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: chat.RECEIVE_MESSAGE,
                    payload: { ...data, read: 1 }
                })
            }
        })
}

export const errors = (message, errors={}) => (dispatch) => {
    dispatch({
        type: chat.SET_ERRORS,
        payload: {
            message,
            errors
        }
    });
}
