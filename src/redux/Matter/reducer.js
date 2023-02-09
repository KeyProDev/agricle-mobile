import matter from './constants';

const initialState = {
    matters: [],
    recentMatters: [],
    favouriteMatters: [],
    matter: {},

    errors: {},

    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case matter.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case matter.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };
        case matter.SET_MATTERS:
            return {
                ...state,
                matters: action.payload,
                loading: false,
            }
        case matter.SET_RECENT_MATTERS:
            return {
                ...state,
                recentMatters: action.payload,
                loading: false,
            }
        case matter.ADD_MATTERS:
            return {
                ...state,
                matters: state.matters.concat(action.payload),
                loading: false,
            }
        case matter.SET_MATTER:
            const { matterId } = action.payload;
            return {
                ...state,
                matter: state.matters.find(matter => matter.id === matterId) ? state.matters.find(matter => matter.id === matterId) : {},
                loading: false,
            }
        case matter.SET_FAVOURITE_MATTERS:
            return {
                ...state,
                favouriteMatters: action.payload,
                loading: false,
            }
        case matter.ADD_FAVOURITE_MATTERS:
            return {
                ...state,
                matters: state.matters.concat(action.payload),
                loading: false,
            }
        case matter.REMOVE_FAVOURITE_MATTER:
            return {
                ...state,
                favouriteMatters: state.favouriteMatters.filter(matter => matter.id !== action.payload)
            }
        case matter.SET_FAVOURITE:
            return {
                ...state,
                matters: state.matters.map(matter => {
                    if(matter.id === action.payload.matterId) {
                        matter.is_favourite = action.payload.is_favourite;
                    }
                    return matter;
                })
            }
        case matter.SET_ERRORS:
            return {
                ...state,
                errors: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
