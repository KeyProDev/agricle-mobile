import axios from "axios";
import base from './constants';
import {httpService} from '../../services/httpService';

export const getPrefectures = (postNumber) => async (dispatch) => {
    dispatch({
        type: base.SET_LOADING,
    });
    axios.get('https://zipcloud.ibsnet.co.jp/api/search?zipcode='+postNumber)
        .then(res => {
            dispatch({
                type: base.UNSET_LOADING,
            });
            dispatch({
                type: base.SET_PREFECTURES,
                payload: res.data,
            });
        })
        .catch(err => {
            dispatch({
                type: base.UNSET_LOADING,
            });
        })
};

export const sendContact = (contact, successAction) => (dispatch) => {
    dispatch({
        type: base.SET_LOADING
    });
    httpService.post('/contact', contact)
        .then(res => {
            dispatch({
                type: base.UNSET_LOADING
            });
            if(res.data.success){
                successAction()
            }
            else{
                dispatch({
                    type: base.SET_ERRORS,
                    payload: res.data.data
                })
            }
        })
        .catch(err => {
            dispatch({
                type: base.UNSET_LOADING,
            });
        })
}
