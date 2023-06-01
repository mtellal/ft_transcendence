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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
