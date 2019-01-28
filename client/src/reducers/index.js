import { combineReducers } from 'redux';
import user from './user';
import board from './board';
import content from "./content";
import account from "./account";

const rootReducer = combineReducers({
  user,
  board,
  account,
  content
});

export default rootReducer;
