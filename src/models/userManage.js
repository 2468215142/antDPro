import {
  getUserList,
  deleteUser,
  updateUser,
} from '../services/user';

const defaultValue = {
  userList: [],
  showUpdate: false,
  updateInfo: {
    name: '',
    email: '',
    password: '',
    phone: '',
    prefix: '',
    _id: '',
  },
}

const UserManageModel = {
  namespace: 'userManage',
  state: {
    ...defaultValue
  },
  effects: {
    * showUpdate({
      payload,
    }, {
      put,
    }) {
      yield put({
        type: 'updata',
        payload: {
          showUpdate: true,
          updateInfo: {
            ...payload.data,
          },
        },
      });
    },

    * hideUpdate({}, {
      put,
    }) {
      yield put({
        type: 'updata',
        payload: {
          showUpdate: false,
          updateInfo: {
            name: '',
            email: '',
            password: '',
            phone: '',
            prefix: '',
            _id: '',
          },
        },
      });
    },


    * showUpdateSubmit({
      payload,
    }, {
      put,
      call,
    }) {
      const resupdate = yield call(updateUser, payload.data);
      const resList = yield call(getUserList, payload.data);
      if (resList && resupdate) {
        yield put({
          type: 'updata',
          payload: {
            showUpdate: false,
            userList: resList.data,
            updateInfo: {
              name: '',
              email: '',
              password: '',
              phone: '',
              prefix: '',
              _id: '',
            },
          },
        });
      }
    },


    * deleteUser({
      payload,
    }, {
      put,
      call,
    }) {
      const resDelete = yield call(deleteUser, payload.data);
      const resList = yield call(getUserList, payload.data);
      if (resDelete && resList) {
        yield put({
          type: 'updata',
          payload: {
            showUpdate: false,
            userList: resList.data,
          },
        });
      }
    },


    * getUserList({
      payload,
    }, {
      put,
      call,
    }) {
      const res = yield call(getUserList, payload.data);
      if (res) {
        yield put({
          type: 'updata',
          payload: {
            userList: res.data,
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
export default UserManageModel;