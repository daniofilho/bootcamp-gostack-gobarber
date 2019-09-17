/**
 * Arquivo que faz com que o redux persist, através do storage, salve as informações
 * dos reducers/states de acordo com a plataforma. No caso da web, salva no localStorage
 */
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'gobarber',
      storage,
      whiteList: ['auth', 'user'],
    },
    reducers
  );

  return persistedReducer;
};
