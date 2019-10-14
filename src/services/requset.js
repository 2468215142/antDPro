import { Request } from './requestConfig';

/**
 * post请求
 * @param {string} url 请求链接
 * @param {object} data 请求参数
 */
export const Post = (url, data = {}) =>
  Request(url, {
    method: 'post',
    data,
  });

/**
 * get请求
 * @param {string} url 请求链接
 * @param {object} data 请求参数
 */
export const Get = (url, data = {}) =>
  Request(url, {
    params: {
      ...data,
    },
  });
