import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const req = await fetch('http://192.168.8.187:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const response = req.json();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const req = await fetch('http://192.168.8.187:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const response = req.json();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const get_info = createAsyncThunk('auth/info', async (data, thunkAPI) => {

    const { rejectWithValue } = thunkAPI;
    try {

        const req = await fetch('http://192.168.8.187:8000/api/info/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data}`

            },
        });

        const response = req.json();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

const initialState = {
    isLoading: false,
    wrongLogin: false,
    isLogged: false,
    isAdmin: false,
    token: null,
    refresh_token: null,
    userAuth: null,
    respRegister: null,
    errorRegister: false,
    phone_number: null,
    name: null,
    user_id: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Here you define your internal reducers
        // Example: updating user settings
        logout: (state, action) => {
            state.isLogged = false;
            state.token = null;
            state.isAdmin = false;
            state.refresh_token = null;
            state.userAuth = null;
            state.phone_number = null;
            state.name = null;
            state.user_id = null;

        }
    },
    extraReducers: (builder) => {
        builder
            //login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.wrongLogin = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.detail === "No active account found with the given credentials" || action.payload.detail === "You do not have permission to perform this action.") {
                    state.wrongLogin = true;
                }
                else {
                    state.wrongLogin = false;
                    state.isLogged = true;
                    state.token = action.payload.access;
                    state.refresh_token = action.payload.refresh;
                    state.userAuth = action.meta.arg.username;
                }
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
                state.wrongLogin = false;
                state.isLogged = false;
            })

            //register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.errorRegister = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.respRegister = action.payload;
            })
            .addCase(register.rejected, (state) => {
                state.wrongLogin = true;
                state.isLoading = false;
                state.isLogged = false;
                state.errorRegister = true;
            })

            //get_info
            .addCase(get_info.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_info.fulfilled, (state, action) => {

                state.isLoading = false;
                if (action.payload.detail !== "No active account found with the given credentials") {
                    state.isLogged = true;
                    state.isAdmin = action.payload.is_superuser;
                    state.userAuth = action.payload.username;
                    state.phone_number = action.payload.phone_number;
                    state.name = action.payload.name;
                    state.user_id = action.payload.id;
                    state.token = action.meta.arg;
                }
                else {
                    state.wrongLogin = true;
                }
            })
            .addCase(get_info.rejected, (state) => {
                state.isLoading = false;
                state.wrongLogin = true;
                state.isLogged = false;

            })





    }
    // extraReducers: {
    //     [login.pending]: (state) => {
    //         state.isLogging = true;
    //     },
    //     [login.fulfilled]: (state, action) => {
    //         state.isLogging = false;
    //         // state.token = action.payload.token;
    //         // state.refresh_token = action.payload.refresh_token;
    //         // state.userAuth = action.payload.user;
    //         console.log(action);
    //     },
    //     [login.rejected]: (state) => {
    //         state.isLogging = false;
    //     }
    // }

})
export const { logout } = authSlice.actions;
export default authSlice.reducer;
