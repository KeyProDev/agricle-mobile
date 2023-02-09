import chat from './constants';

const initialState = {
    recruitments: [],
    recruitment: {},
    applicants: [],

    receiver: {},
    messages: [],
    unreadMessages: [],
    recruitment_id: 0, // if it's 0 chatting is favourite chatting, it's bigger than 0 chatting is recruitment chatting

    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case chat.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case chat.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };

        case chat.SET_RECRUITMENTS:
            return {
                ...state,
                recruitments: action.payload,
                loading: false
            };

        case chat.SET_RECRUITMENT:
            return {
                ...state,
                recruitment: action.payload,
                loading: false
            };

        case chat.SET_FAVOURITES:
            return {
                ...state,
                favourites: action.payload,
                loading: false
            };

        case chat.SET_APPLICANTS:
            return {
                ...state,
                applicants: action.payload,
                loading: false
            };

        case chat.SET_CHATTING:
            return {
                ...state,
                receiver: action.payload.receiver,
                recruitment_id: action.payload.recruitment_id,
                loading: false
            };

        case chat.SET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                unreadMessages: state.unreadMessages.filter(message => {
                    if(action.payload.map(msg => msg.id).length) return !action.payload.map(msg => msg.id).includes(message.id);
                    else return true;
                }),
                loading: false
            };

        case chat.SEND_SUCCESS:
            return {
                ...state,
                messages: state.messages.map(message => {
                    if(message.message_id === action.payload.sending_id) return action.payload;
                    else return message;
                }),
                loading: false
            };

        case chat.ADD_MESSAGES:
            let messages = state.messages;
            action.payload.forEach(message => {
                if(!!!messages.find(old => old.message_id === message.message_id)) messages.push(message);
            })
            return {
                ...state,
                messages: messages,
                unreadMessages: state.unreadMessages.filter(message => {
                    if(action.payload.map(msg => msg.id).length) return !action.payload.map(msg => msg.id).includes(message.id);
                    else return true;
                }),
                loading: false
            };

        case chat.SET_ERRORS:
            return {
                ...state,
                errors: action.payload.errors,
                loading: false
            };

        case chat.RECEIVE_MESSAGE:
            if(state.messages.find(message => message.id == action.payload.id)) return { ...state }
            return {
                ...state,
                messages: [
                    ...state.messages,
                    action.payload
                ],
                unreadMessages: state.unreadMessages.filter(message => parseInt(message.id) !== parseInt(action.payload.id))
            }

        case chat.SET_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: action.payload
            }

        case chat.ADD_UNREAD_MESSAGE:
            if(!!state.unreadMessages.find(msg => parseInt(msg.id) === action.payload.id)) return state;
            return {
                ...state,
                unreadMessages: [...state.unreadMessages, action.payload]
            }

        default:
            return state;
    }
}
