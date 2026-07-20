
import { REQUEST_METHOD } from '../common/constant';
import { API_URL } from '../common/url';
import { ACTION_TYPES, ACTIONS } from './actions';

const registerApi = (data) => {
  return {
    url: API_URL.REGISTER,
    method: REQUEST_METHOD.POST,
    payload: {
      types: ACTION_TYPES[ACTIONS.REGISTER],
      data
    }
  };
};


export {
  registerApi
};
