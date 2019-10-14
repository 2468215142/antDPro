import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage/session';

const persistConfig = {
  key: 'storage',
  storage,
};
const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store);
  return { ...store, persist };
};
export function config() {
    return {
      onError(err) {
        err.preventDefault();
        /**
         * 监控异常，在此处可进行错误上报
         */
        // eslint-disable-next-line no-console
        console.group('%c异常', 'color:red');
        // eslint-disable-next-line no-console
        console.log(`%c%s异常${JSON.stringify(err)}`, 'color:red; background:yellow;');
        // eslint-disable-next-line no-console
        console.log(err);
        // eslint-disable-next-line no-console
        console.groupEnd();
      },
      extraEnhancers: [
        persistEnhancer(),
      ],
    };
}
