import { httpService } from '../../services/httpService';
import recruitment from './constants';

export const getAll = () => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.get(`/recruitments`)
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: recruitment.SET_RECRUITMENTS,
                    payload: res.data.data,
                });
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            console.log("getAllError:", err)
        });
};

export const create = (data, navigation) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.post('/recruitment', data, true)
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch(getAll());
                navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentList' }});
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            console.log(err);
        })
}

export const update = (data, navigation) => (dispatch) => {
    httpService.post('/recruitment/update', data, true)
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch(getAll());
                navigation.navigate('ProducerHome', { screen: 'RecruitmentMain', params: { screen: 'RecruitmentList' }});
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        })
}

export const setActiveStatus = (status = 'draft') => (dispatch) => {
    dispatch({
        type: recruitment.SET_ACTIVE_STATUS,
        payload: status
    });
};

export const setRecruitment = (id) => (dispatch) => {
    dispatch({
        type: recruitment.SET_RECRUITMENT,
        payload: id
    })
}

export const setRecruitmentStatus = (id, status, comment=null) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.put('/recruitment/status', {id, status, comment})
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch(getAll());
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        });
}

export const deleteRecruitment = (id) => async (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.deleteDetail(`/recruitment/${id}`)
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: recruitment.DELETE_RECRUITMENT,
                    payload: id
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        })
}

export const createAddon = (id, postscript) => async (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.post('/recruitment/addon', {id, postscript})
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: recruitment.CREATE_ADDON_SUCCESS,
                    payload: res.data.data
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        })
}

export const getApplicants = (recruitmentId, navigateAction) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.get(`/applicants/${recruitmentId}`)
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: recruitment.SET_APPLICANTS,
                    payload: res.data.data
                });
                navigateAction();
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        })
}

export const getApplicant = (recruitmentId, workerId, navigateAction) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.get(`/applicant/${recruitmentId}/${workerId}`)
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });

            if(res.data.success) {
                dispatch({
                    type: recruitment.SET_APPLICANT,
                    payload: res.data.data
                });
                navigateAction();
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        });
}

export const setApplicant = (applicant, navigateAction) => (dispatch) => {
    dispatch({
        type: recruitment.SET_APPLICANT,
        payload: applicant
    });
    navigateAction();
}

export const setApplicantStatus = (recruitmentId, applicantId, status, employ_memo, navigation) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.put('/applicant/status', { recruitmentId, applicantId, status, employ_memo })
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch(getApplicants(recruitmentId, () => { navigation.navigate('RecruitmentApplicants') } ));
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        });
}

export const evaluateWorker = (applicantId, workerEvaluation, workerReview) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.put('/applicant/evaluate_worker', { applicantId, workerEvaluation, workerReview })
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: recruitment.EVALUATE_WORKER_SUCCESS,
                    payload: {
                        applicantId,
                        workerEvaluation,
                        workerReview
                    }
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        });
}

export const setFavouriteUser = (favourite_id) => (dispatch) => {
    dispatch({
        type: recruitment.SET_LOADING,
    });
    httpService.put('/favourite/user', {favourite_id})
        .then(res => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: recruitment.SET_FAVOURITE_USER,
                    payload: favourite_id
                });
            }
        })
        .catch(err => {
            dispatch({
                type: recruitment.UNSET_LOADING,
            });
        })
}

export const errors = (message, errors={}) => (dispatch) => {
    dispatch({
        type: recruitment.SET_ERRORS,
        payload: {
            message,
            errors
        }
    });
}
