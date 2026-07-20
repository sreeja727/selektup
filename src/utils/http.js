import { createAction } from '@reduxjs/toolkit';
import { call, put, select } from 'redux-saga/effects';
import {
  deleteRequest, getRequest, patchRequest, postRequest, putRequest
} from '../app/axios';
import {
  HTTP_HEADERS, REQUEST_METHOD, REQUEST_STATUS
} from '../common/constant';
import { _ } from '../common/lodash';
import { ApiStatus } from '../app/ApiStatus';
import { getCommonConfigSelector } from '../pages/common/selectors';
import { actions as commonActions } from '../pages/common/slice';
import { MIME_TO_EXT, RESPONSE_TYPE } from '../pages/others/fileDownload/constant';
import { getFileObjFromBuffer } from '../pages/others/fileDownload/helpers';
import { STORAGE_KEYS } from './constants';

const apiStatus = new ApiStatus();

export const getBaseQuery = () => { };

const getApiMethod = (method) => {
  switch (method) {
    case REQUEST_METHOD.DELETE:
      return deleteRequest;
    case REQUEST_METHOD.PUT:
      return putRequest;
    case REQUEST_METHOD.PATCH:
      return patchRequest;
    case REQUEST_METHOD.POST:
      return postRequest;
    case REQUEST_METHOD.MULTIPART:
      return postRequest;
    default:
      return getRequest;
  }
};

const getRequestParams = ({
  url,
  data: requestData = {},
  params: requestParams = {},
  method,
  paramsSerializer = {},
  // commonConfig,
  customHeaders: tempHeaders = {},
  bearerToken
}) => {
  let params = {};
  let data = {};
  const headers = { ...HTTP_HEADERS };
  if (method === REQUEST_METHOD.MULTIPART) {
    _.set(headers, 'Content-Type', 'multipart/form-data');
  }
  if (method === REQUEST_METHOD.POST) {
    _.set(headers, 'Content-Type', 'application/json');
  }
  if (method === REQUEST_METHOD.DELETE || method === REQUEST_METHOD.GET) {
    params = { ...requestData, ...requestParams };
    data = {};
  } else {
    params = requestParams;
    data = requestData;
  }
  let baseURL = import.meta.env.VITE_API_URL;
  let authHeaders = {};

  if (bearerToken) {
    authHeaders = { Authorization: `Bearer ${bearerToken}` };
  }

  if (url.includes('aadhaar-services')) {
    baseURL = import.meta.env.VITE_SDC_API_URL;
  }

  const customHeaders = {
    // 'X-STATE-CODE': STATE.code.toLowerCase(),
    // 'X-LANGUAGE': commonConfig?.lang,
    ...tempHeaders
  };

  return {
    config: {
      headers: {
        ...headers,
        ...authHeaders,
        ...customHeaders
      },
      params,
      paramsSerializer
    },
    baseURL,
    data,
    api: getApiMethod(method)
  };
};

function* handleExtraResponse(response, isDocument, documentType, successAction) {
  let responsePayLoad = {};
  if (isDocument) {
    try {
      if (documentType === RESPONSE_TYPE.ARRAY_BUFFER) {
        responsePayLoad = {
          data: getFileObjFromBuffer(response)
        };
      } else {
        const { type = 'image/jpeg', size } = response;
        const fileUrl = window.URL.createObjectURL(response);
        responsePayLoad = {
          data: {
            url: fileUrl,
            type,
            size,
            ext: MIME_TO_EXT[type] || 'jpeg'
          }
        };
      }
    } catch {
      responsePayLoad = {
        data: {
          url: '',
          type: 'invalid/invalid',
          size: 0,
          ext: 'invalid'
        }
      };
      yield put(commonActions.setCustomToast({
        variant: 'error', message: 'Please Try Again', title: '', open: true
      }));
    }
  } else {
    responsePayLoad = _.has(response, 'response')
      ? {
        data: _.get(response, 'response', {}),
        message: _.get(response, 'message', ''),
        errorMessage: _.get(response, 'errorMessage', null)
      }
      : { data: response };
  }
  const errorMessage = _.get(responsePayLoad, 'errorMessage', '');
  if (errorMessage && errorMessage !== null) {
    yield put(commonActions.setCustomToast({
      variant: 'warning', message: errorMessage, title: 'WhenYou', open: true
    }));
  }
  yield put(
    successAction({
      ...responsePayLoad,
      isLoading: false,
      status: REQUEST_STATUS.SUCCESS
    })
  );
}

function* invokeApi(method, url, payload) {
  const {
    types = ['REQUEST', 'SUCCESS', 'FAILURE'], data: payloadData, params = {},
    isDocument = false, headers, documentType, paramsSerializer = {}
  } = payload;
  const requestAction = createAction(types[0]);
  const successAction = createAction(types[1]);
  const failureAction = createAction(types[2]);

  const commonConfig = yield select(getCommonConfigSelector);
  const bearerToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  // if (_.isEmpty(bearerToken) && !WHITE_LIST_URL.includes(url)) {
  //   apiStatus.tokenExpired = true;
  //   yield put(logout());
  //   return { response: {}, error: {} };
  // }

  apiStatus.tokenExpired = false;

  const {
    api, config, baseURL, data
  } = getRequestParams({
    url,
    data: payloadData,
    params,
    method,
    commonConfig,
    customHeaders: headers,
    bearerToken,
    paramsSerializer
  });

  if (isDocument) {
    _.set(config, 'responseType', 'blob');
    if (documentType === RESPONSE_TYPE.ARRAY_BUFFER) {
      const streamConfig = config.headers;
      delete streamConfig.Accept;
      _.set(config, 'responseType', 'arraybuffer');
      _.set(config, 'headers', streamConfig);
    }
  }

  yield put(requestAction({ isLoading: true, status: REQUEST_STATUS.PROGRESS }));

  const apiResponse = yield call(api, url, { config, baseURL, data });
  const { data: response, error = {} } = apiResponse;
  if (!_.isEmpty(error)) {
    const { code, response: { status, data: errorData = {} } = {} } = error;
    const { error: badReqTitle = '', message: badReqMessage = 'ERR_BAD_REQUEST', errorMessage = '' } = errorData || {};
    yield put(failureAction({
      error: errorData, errorData, isLoading: false, status: REQUEST_STATUS.FAILED
    }));
    let title = 'Something Unexpected';
    let description = 'Please try again later';
    if (code === 'ERR_NETWORK') {
      description = 'You are Not Connected To Internet';
    }

    switch (status) {
      case 400:
        title = badReqTitle || title;
        description = badReqMessage;
        break;
      case 401:
        description = errorMessage;
        title = 'Unauthorized';
        // if (!WHITE_LIST_URL.includes(url))
        // yield put(commonSliceActions.setTokenExpiryAlert(true));
        break;
      case 402:
        description = 'Payment Required';
        break;
      case 403:
        description = 'Permission Denied';
        break;
      default:
        break;
    }
    yield put(commonActions.setCustomToast({
      variant: 'error', message: description, title, open: true
    }));
  } else if (_.has(response, 'error')) {
    const customError = response.error || {};
    yield put(
      failureAction({
        error: customError,
        isLoading: false,
        status: REQUEST_STATUS.FAILED
      })
    );
    yield put(commonActions.setCustomToast({
      variant: 'error', message: 'Please Try Again', title: '', open: true
    }));
  } else {
    yield* handleExtraResponse(response, isDocument, documentType, successAction);
  }

  return { response, error };
}


export function* handleAPIRequest(apiFn, ...rest) {
  const { method, url, payload } = apiFn(...rest);
  try {
    if (!apiStatus.tokenExpired) {
      return yield call(invokeApi, method, url, payload);
    }
    apiStatus.dataArray = [...apiStatus.dataArray, yield call(invokeApi, method, url, payload)];
  } catch (error) {
    apiStatus.dataArray = [...apiStatus.dataArray, yield call(invokeApi, method, url, payload)];
  
    console.error(error);
  }
}
