// import { configureStore } from "@reduxjs/toolkit"
// import { userSlice } from "./user/user-slice";
// const store = configureStore({
//     reducer: {
//         USER: userSlice.reducer,
//     },
// });
// export { store };
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user-slice";
const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
export default store;
