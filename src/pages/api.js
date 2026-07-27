
import { REQUEST_METHOD } from '../common/constant';
import { API_URL } from '../common/url';
import { ACTION_TYPES, ACTIONS } from './actions';

const registerApi = (data) => {
  return {
    url: API_URL.REGISTER,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REGISTER_API],
      data
    }
  };
};
 const loginApi =(data)=>{
  return{
    url:API_URL.LOGIN,
    method:REQUEST_METHOD.POST,
    payload:{
      types:ACTION_TYPES[ACTIONS.LOGIN],
      data
    }
  }
 }

const forgotPasswordApi = (data) => {
  return {
    url: API_URL.FORGOT_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.FORGOT_PASSWORD],
      data
    }
  };
};

const resetPasswordApi = (data) => {
  return {
    url: API_URL.RESET_PASSWORD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.RESET_PASSWORD],
      data
    }
  };
};

export {
  registerApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi
};
