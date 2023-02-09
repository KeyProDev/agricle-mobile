import base from './constants';

const initialState = {
    prefectures: '',
    city: '',
    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case base.SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case base.UNSET_LOADING:
            return {
                ...state,
                loading: false
            };

        case base.SET_PREFECTURES:
            const data = action.payload;
            return {
                ...state,
                prefectures: data["results"][0]["prefcode"],
                city: data["results"][0]["address2"]+" "+data["results"][0]["address3"],
                loading: false
            };
        default:
            return state;
    }
}
