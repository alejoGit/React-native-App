import {createStore} from 'redux';
import reducer from './reducers/menus';

const store = createStore(reducer, {});

export default store;