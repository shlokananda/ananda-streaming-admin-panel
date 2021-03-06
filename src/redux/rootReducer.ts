import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import artistReducer from './slices/artist';
import songReducer from './slices/song';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import userReducer from './slices/user';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  artist: artistReducer,
  song: songReducer,
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  calendar: calendarReducer,
  product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };
