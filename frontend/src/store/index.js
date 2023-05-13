import { configureStore } from "@reduxjs/toolkit"
import { userSlice } from "./user/user-slice";

const store = configureStore({
    reducer: {
        USER: userSlice.reducer,
    },
});

export { store };