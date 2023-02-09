import recruitment from './constants';

const initialState = {
    recruitments: [],
    recruitment: {},

    applicants: [],
    applicant: {},

    activeStatus: 'draft', // 'draft', 'collecting', 'working', 'completed'

    errors: [],
    error_message: '',

    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case recruitment.SET_LOADING:
            return {
                ...state,
                loading: true,
                errors: []
            };

        case recruitment.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };

        case recruitment.SET_RECRUITMENTS:
            return {
                ...state,
                recruitments: action.payload,
                loading: false
            };

        case recruitment.SET_RECRUITMENT:
            return {
                ...state,
                recruitment: state.recruitments.find(recruitment => recruitment.id == action.payload) ? state.recruitments.find(recruitment => recruitment.id == action.payload) : {},
                loading: false,
            };

        case recruitment.SET_APPLICANTS:
            return {
                ...state,
                applicants: action.payload,
                loading: false,
            }

        case recruitment.SET_APPLICANT:
            return {
                ...state,
                applicant: action.payload,
                loading: false,
            };

        case recruitment.SET_ACTIVE_STATUS:
            return {
                ...state,
                activeStatus: action.payload,
                loading: false,
            }

        case recruitment.EVALUATE_WORKER_SUCCESS:
            const {
                applicantId,
                workerEvaluation,
                workerReview
            } = action.payload;
            return {
                ...state,
                applicants: state.applicants.map(applicant => {
                    if(applicant.id === applicantId) return { ...applicant, worker_review: workerReview, worker_evaluation: workerEvaluation };
                    else return applicant;
                }),
                loading: false,
            }

        case recruitment.CREATE_ADDON_SUCCESS:
            return {
                ...state,
                recruitment: action.payload,
                loading: false
            }

        case recruitment.SET_FAVOURITE_USER:
            return {
                ...state,
                applicant: {
                    ...state.applicant,
                    is_favourite: !state.applicant.is_favourite
                },
                loading: false
            }

        case recruitment.DELETE_RECRUITMENT:
            return {
                ...state,
                recruitments: state.recruitments.filter(recruitment => recruitment.id != action.payload),
                loading: false
            }

        case recruitment.SET_ERRORS:
            return {
                ...state,
                errors: action.payload.errors,
                error_message: action.payload.message,
                loading: false
            };

        default:
            return state;
    }
}
