import { httpService } from '../../services/httpService';
import application from './constants';

export const getAll = () => (dispatch) => {
    dispatch({
        type: application.SET_LOADING,
    });
    httpService.get('/applications/events')
        .then(res => {
            dispatch({
                type: application.UNSET_LOADING,
            });
            if(res.data.success) {
                dispatch({
                    type: application.SET_APPLICATIONS,
                    payload: res.data.data
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: application.UNSET_LOADING,
            });
            console.log(err);
        });
}

export const getApplications = (skip=0, limit=10, status='waiting') => (dispatch) => {
    dispatch({
        type: application.SET_LOADING,
    });
    httpService.post(`/applications/status`, { skip, limit, status })
        .then(res => {
            if(res.data.success) {
                if(skip === 0) {
                    dispatch({
                        type: application.SET_APPLICATIONS,
                        payload: res.data.data
                    });
                }
                else {
                    dispatch({
                        type: application.ADD_APPLICATIONS,
                        payload: res.data.data
                    });
                }
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: application.UNSET_LOADING,
            });
            console.log(err);
        })
}

export const setApplication = (applicationId, navigateAction) => (dispatch) => {
    dispatch({
        type: application.SET_LOADING
    });
    httpService.get(`/application/${applicationId}`)
        .then(res => {
            dispatch({
                type: application.UNSET_LOADING
            });
            if(res.data.success) {
                dispatch({
                    type: application.SET_APPLICATION,
                    payload: applicationId
                });
                navigateAction();
            }
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: application.UNSET_LOADING
            });
        })
}

export const finish = (recruitmentId, data, successAction) => (dispatch) => {
    dispatch({
        type: application.SET_LOADING
    });
    httpService.post(`/applications/finish/${recruitmentId}`, data)
        .then(res => {
            dispatch({
                type: application.UNSET_LOADING
            });
            if(res.data.success) {
                successAction();
            }
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: application.UNSET_LOADING
            });
        })
}

export const evaluateRecruitment = (applicantId, recruitmentEvaluation, recruitmentReview) => (dispatch) => {
    httpService.put('/applicant/evaluate_recruitment', { applicantId, recruitmentEvaluation, recruitmentReview })
        .then(res => {
            if(res.data.success) {
                dispatch({
                    type: application.EVALUATE_RECRUITMENT_SUCCESS,
                    payload: {
                        applicantId,
                        recruitmentEvaluation,
                        recruitmentReview
                    }
                });
            }
            else {
                dispatch(errors(res.data.message, res.data.data));
            }
        })
        .catch(err => {
            dispatch({
                type: application.UNSET_LOADING,
            });
            console.log('evaluateError:', err)
        });
}

export const errors = (message, errors={}) => (dispatch) => {
    dispatch({
        type: application.SET_ERRORS,
        payload: {
            message,
            errors
        }
    });
}
