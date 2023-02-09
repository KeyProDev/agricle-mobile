import syncStorage  from "sync-storage";

import auth from './constants';
import {httpService} from "../../services/httpService";
import {getAll as getAllRecruitments} from "../Recruitment/actions";
import {getAll as getAllApplications} from "../Application/actions";
import {getUnreadMessages} from "../Chat/actions";
import {getUnreadNotices} from "../Notice/actions";

//Register User
export const register = (profile, errorHandler) => async (dispatch) => {
    try {
        dispatch({
            type: auth.SET_LOADING
        });
        const res = await httpService.post('/register', profile);
        if(res.data.success) {
            await syncStorage.set('token', res.data.data.token);
            dispatch({
                type: auth.REGISTER_SUCCESS,
                payload: res.data.data,
            });
            dispatch(loadUser());
        }
        else {
            dispatch({
                type: auth.REGISTER_FAIL,
                payload: res.data.data
            })
        }
        dispatch({
            type: auth.UNSET_LOADING
        });
    } catch (err) {
        dispatch({
            type: auth.UNSET_LOADING
        });
        errorHandler();
    }
};

export const login = (data) => async (dispatch) => {
    dispatch({
        type: auth.SET_LOADING
    });
    httpService.post('/login', data)
        .then(res => {
            dispatch({
                type: auth.UNSET_LOADING
            });
            if(res.data.success) {
                syncStorage.set('token', res.data.data.token);
                dispatch({
                    type: auth.LOGIN_SUCCESS,
                    payload: res.data.data,
                });
                dispatch(loadUser());
            }
            else {
                if(res.data.data) {
                    dispatch({
                        type: auth.AUTH_ERROR,
                        payload: res.data.data
                    });
                }
                else {
                    dispatch({
                        type: auth.AUTH_ERROR,
                        payload: {
                            connect_error: 1
                        }
                    });
                }
            }
        })
        .catch(err => {
            dispatch({
                type: auth.AUTH_ERROR,
                payload: {
                    connect_error: 1
                }
            });
        });
}

//Load User
export const loadUser = () => async (dispatch) => {
    try {
        const token = await syncStorage.get("token");

        if (token) {
            try {
                const result = await httpService.get("/user");
                if (result.data.success) {
                    dispatch({
                        type: auth.USER_LOADED,
                        payload: result.data,
                    });
                    if(result.data.data.role === 'producer') dispatch(getAllRecruitments());
                    else dispatch(getAllApplications());
                    dispatch(getUnreadMessages());
                    dispatch(getUnreadNotices());
                }
            } catch (err) {
                dispatch(logout());
            }
        }
        else {
            dispatch(logout());
        }
    } catch (err) {
        dispatch(logout());
        dispatch({
            type: auth.AUTH_ERROR,
        });
    }
};

export const logout = () => async (dispatch) => {
    await syncStorage.remove("token");
    dispatch({
        type: auth.LOGOUT,
    });
}
