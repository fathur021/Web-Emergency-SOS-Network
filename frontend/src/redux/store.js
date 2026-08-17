
// ================================================================
// Store Redux = tempat penyimpanan global untuk seluruh state aplikasi.
// ================================================================

import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { sosApi } from './api/sos.Api';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [sosApi.reducerPath]: sosApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, sosApi.middleware),
});