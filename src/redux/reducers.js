import { combineReducers } from 'redux';
import auth from './Auth/reducer';
import base from './Base/reducer';
import recruitment from './Recruitment/reducer';
import application from './Application/reducer';
import matter from './Matter/reducer';
import user from './User/reducer';
import chat from './Chat/reducer';
import notice from './Notice/reducer';

export default combineReducers({
    auth,
    base,
    recruitment,
    application,
    matter,
    user,
    chat,
    notice,
});
