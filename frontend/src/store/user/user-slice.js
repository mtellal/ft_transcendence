import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        user: {
            id: "",
            username: "",
            status: "",
            avatar: "",
            token: "",
        },
    },
    reducers: {
        saveInfoUser: (currentSlice, action) => {
            currentSlice.user.id = action.payload.id;
            currentSlice.user.username = action.payload.username;
            currentSlice.user.status = action.payload.userStatus;
            currentSlice.user.avatar = action.payload.avatar;
        },
        setToken: (currentSlice, action) => {
            currentSlice.user.token = action.payload;
        },
        setAvatar: (currentSlice, action) => {
            currentSlice.user.avatar = action.payload;
        },
    }
})

const { saveInfoUser, setAvatar, setToken } = userSlice.actions;

export { saveInfoUser, setAvatar, setToken };