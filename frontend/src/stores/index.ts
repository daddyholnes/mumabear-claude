import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './slices/apiSlice'
import themeSlice from './slices/themeSlice'
import chatSlice from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    theme: themeSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
