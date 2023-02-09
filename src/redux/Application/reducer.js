import application from './constants';
import matter from '../Matter/constants';

const initialState = {
    applications: [],
    application: {},

    errors: [],

    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case application.SET_LOADING:
            return {
                ...state,
                loading: true
            };

        case application.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };

        case application.SET_APPLICATIONS:
            return {
                ...state,
                applications: action.payload,
                loading: false,
            }

        case application.ADD_APPLICATIONS:
            return {
                ...state,
                applications: state.applications.concat(action.payload),
                loading: false,
            }

        case application.SET_APPLICATION:
            return {
                ...state,
                application: state.applications.find(application => application.applicant_id == action.payload) ? state.applications.find(application => application.applicant_id == action.payload) : {},
                loading: false,
            };

        case application.EVALUATE_RECRUITMENT_SUCCESS:
            const {
                applicationId,
                recruitmentEvaluation,
                recruitmentReview
            } = action.payload;
            return {
                ...state,
                applications: state.applications.map(application => {
                    if(application.applicant_id === applicationId) return { ...application, recruitment_review: recruitmentReview, recruitment_evaluation: recruitmentEvaluation };
                    else return application;
                }),
                loading: false,
            }

        case application.SET_ERRORS:
            return {
                ...state,
                errors: action.payload.errors,
                loading: false
            };

        case matter.SET_FAVOURITE:
            console.log(state.applications, action.payload);
            return {
                ...state,
                applications: state.applications.map(application => {
                    if(application.recruitment_id == action.payload.matterId) {
                        application.is_favourite = action.payload.is_favourite
                    }
                    return application;
                })
            }

        default:
            return state;
    }
}
