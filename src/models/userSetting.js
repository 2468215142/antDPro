const UserSettingModel = {
    namespace: 'userSetting',
    state: {},
    effects: {},
    reducers: {
      updata(state, action) {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
  };
  export default UserSettingModel;
  