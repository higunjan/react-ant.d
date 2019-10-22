import { combineReducers } from 'redux';
import counter from './counter';
import otp from './otp';
import dashboard from './dashboard';
export default combineReducers({
  counter,
  otp,
  dashboard
})
