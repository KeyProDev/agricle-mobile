import user from './constants';

const initialState = {
    user: {},
    producer: {},
    worker: {},
    recruitments: [],
    farmers: [],
    farms: [],

    errors: {},

    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case user.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case user.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };
        case user.SET_USER_PROFILE:
            return {
                ...state,
                user: action.payload,
                loading: false
            };
        case user.SET_PRODUCER_PROFILE:
            return {
                ...state,
                producer: action.payload,
                loading: false
            };
        case user.SET_WORKER_PROFILE:
            return {
                ...state,
                worker: action.payload,
                loading: false
            };
        case user.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false
            };
        case user.SET_RECRUITMENTS:
            return {
                ...state,
                recruitments: action.payload,
                loading: false,
            }
        case user.SET_FARMERS:
            return {
                ...state,
                farmers: action.payload,
                loading: false,
            }
        case user.SET_FARMS:
            return {
                ...state,
                farms: action.payload,
                loading: false,
            }
        case user.SET_ERRORS:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
