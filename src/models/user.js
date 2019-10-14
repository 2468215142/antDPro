const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
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
export default UserModel;
