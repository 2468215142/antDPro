const Music = {
  namespace: 'music',
  state: {
    file: {},
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
export default Music;
