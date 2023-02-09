import notice from './constants';

const initialState = {
    notices: [],
    unreadNews: [],

    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case notice.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case notice.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };

        case notice.SET_NOTICES:
            return {
                ...state,
                notices: action.payload.sort((a, b) => b.created_at > a.created_at),
                loading: false
            };

        case notice.SET_UNREAD_NOTICES:
            return {
                ...state,
                unreadNews: action.payload,
                loading: false
            }

        case notice.ADD_UNREAD_NOTICE:
            if(!!state.unreadNews.find(news => parseInt(news.id) === parseInt(action.payload.id))) return state
            return {
                ...state,
                unreadNews: [ ...state.unreadNews, action.payload ],
            }

        case notice.SET_READ_NEWS:
            return {
                ...state,
                unreadNews: state.unreadNews.filter(news => news.id !== action.payload),
            }

        case notice.DELETE_NEWS_SUCCESS:
            return {
                ...state,
                notices: state.notices.filter(news => !action.payload.includes(news.id)),
                unreadNews: state.unreadNews.filter(news => !action.payload.includes(news.id)),
            }

        case notice.SET_ERRORS:
            return {
                ...state,
                errors: action.payload.errors,
                loading: false
            };

        default:
            return state;
    }
}
