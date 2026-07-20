import axios from 'axios';

export const getRequest = (URL, payload) => {
  const { config = {}, baseURL } = payload;
  return axios.get(`${baseURL}/${URL}`, config).then((response) => response).catch((error) => ({ error }));
};

export const deleteRequest = (URL, payload) => {
  const { config = {}, baseURL } = payload;
  return axios.delete(`${baseURL}/${URL}`, config).then((response) => response).catch((error) => ({ error }));
};

export const putRequest = (URL, payload) => {
  const { data = {}, config = {}, baseURL } = payload;
  return axios.put(`${baseURL}/${URL}`, data, config).then((response) => response).catch((error) => ({ error }));
};

export const postRequest = (URL, payload) => {
  const { data = {}, config = {}, baseURL } = payload;
  return axios.post(`${baseURL}/${URL}`, data, config).then((response) => response).catch((error) => ({ error }));
};

export const patchRequest = (URL, payload) => {
  const { data = {}, config = {}, baseURL } = payload;
  return axios.patch(`${baseURL}/${URL}`, data, config).then((response) => response).catch((error) => ({ error }));
};
