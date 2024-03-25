import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import product from './productSlice'
const store = configureStore({
    reducer: {
        product: product,
        auth: auth,

    }
})
export default store;