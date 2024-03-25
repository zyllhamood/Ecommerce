import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const get_products = createAsyncThunk('product/get', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const req = await fetch('http://192.168.8.187:8000/api/products/')
        return req.json();
    } catch (error) {

        return rejectWithValue(error.message)
    }
})

export const get_reviews = createAsyncThunk('product/reviews', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const req = await fetch('http://192.168.8.187:8000/api/reviews/')
        return req.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const get_categories = createAsyncThunk('product/categories', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const req = await fetch('http://192.168.8.187:8000/api/categories/')
        return req.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const get_paid = createAsyncThunk('product/paid', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    console.log('token paid2')
    console.log(data)
    try {
        const req = await fetch('http://192.168.8.187:8000/api/paid/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data}`
            },
        })
        return req.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const get_my_reviews = createAsyncThunk('product/my_reviews', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const req = await fetch('http://192.168.8.187:8000/api/my-reviews/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data}`
            },
        })
        return req.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
const initialState = {
    products: null,
    isLoading: false,
    reviews: null,
    categories: null,
    paid: null,
    my_reviews: null
}

const productSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        builder
            //get_products
            .addCase(get_products.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_products.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(get_products.rejected, (state) => {

                state.isLoading = false;
            })

            //get_reviews
            .addCase(get_reviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_reviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload;
            })
            .addCase(get_reviews.rejected, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
            })

            //get_categories
            .addCase(get_categories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_categories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(get_categories.rejected, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
            })

            //get_paid
            .addCase(get_paid.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_paid.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paid = action.payload;
            })
            .addCase(get_paid.rejected, (state, action) => {
                state.isLoading = false;
            })

            //get_my_reviews
            .addCase(get_my_reviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_my_reviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.my_reviews = action.payload;
            })
            .addCase(get_my_reviews.rejected, (state, action) => {
                state.isLoading = false;
            })
    }
})

export default productSlice.reducer;