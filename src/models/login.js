import {
  routerRedux,
} from 'dva/router';
import {
  stringify,
} from 'querystring';
import {
  getFakeCaptcha,
} from '@/services/login';
import {
  setAuthority,
} from '@/utils/authority';
import {
  getPageQuery,
} from '@/utils/utils';

import {
  login,
} from '../services/user';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({
      payload,
    }, {
      call,
      put,
    }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      yield put({
        type: 'user/updata',
        payload: {
          currentUser: response.data,
        },
      });

      if (response.status === 200) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {
          redirect,
        } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    * getCaptcha({
      payload,
    }, {
      call,
    }) {
      yield call(getFakeCaptcha, payload);
    },

    * logout(_, {
      put,
    }) {
      const {
        redirect,
      } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {
      payload,
    }) {
      setAuthority(payload.currentAuthority || 'adimn');
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
export default Model;
