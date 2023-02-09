import auth from './constants';

const initialState = {
    token: null,
    isAuthenticated: null,
    loading: false,
    user: {},
    errors: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case auth.SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case auth.UNSET_LOADING:
            return {
                ...state,
                loading: false
            }
        case auth.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload.data,
            };
        case auth.REGISTER_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
            };
        case auth.LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                errors: {},
                isAuthenticated: true,
                loading: false,
            };
        case auth.REGISTER_FAIL:
            return {
                ...state,
                errors: action.payload,
                loading: false,
            }
        case auth.LOGIN_FAIL:
            return {
                ...state,
                errors: action.payload,
                loading: false,
            }
        case auth.AUTH_ERROR:
            return {
                ...state,
                errors: action.payload,
                loading: false,
            }
        case auth.LOGOUT:
            return initialState;
        default:
            return state;
    }
}
