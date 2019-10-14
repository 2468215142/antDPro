import {
  regist,
} from '../services/user';

const Model = {
  namespace: 'register',
  state: {
    registerInfo: {
      name: '',
      email: '',
      password: '',
      phone: '',
      prefix: '',
    },
    defaultValue: {
      name: '孤舟江海寄余生',
      email: '3198747592@qq.com',
      password: 'admin',
      phone: '13083450373',
      prefix: '',
    },
    registerStep: 1,
  },

  effects: {
    * updateSteps({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'updata',
        payload,
      });
    },

    * updateInfo({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'updata',
        payload,
      });
    },

    * registSubmit({
      payload,
    }, {
      put,
      call,
    }) {
      const res = yield call(regist, payload.data);
      if (res.status === 200) {
        yield put({
          type: 'updata',
          payload: {
            registerStep: 2,
          },
        });
      }
    },
  },
  reducers: {
    updata(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Model;
