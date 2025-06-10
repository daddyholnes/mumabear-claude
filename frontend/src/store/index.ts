// Redux Store Configuration for Podplay Sanctuary
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import chatReducer from './chatSlice';
import experienceReducer from './experienceSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    chat: chatReducer,
    experience: experienceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
