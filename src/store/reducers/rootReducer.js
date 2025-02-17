import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'; // syncing firestore
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import todoListReducer from './todoListReducer';

const rootReducer = combineReducers({
  //
  auth: authReducer,
  todoList: todoListReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;