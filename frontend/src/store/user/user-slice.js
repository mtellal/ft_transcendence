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
            console.log('saveInfoUser', action);
            currentSlice.user.id = action.payload.id;
            currentSlice.user.username = action.payload.username;
            currentSlice.user.status = action.payload.userStatus;
            currentSlice.user.avatar = action.payload.avatar;
        },
        setToken: (currentSlice, action) => {
            // console.log('ACTION', action.payload);
            currentSlice.user.token = action.payload;
        },
        setAvatar: (currentSlice, action) => {
            // console.log('SET AVATAR', action.payload);
            currentSlice.user.avatar = action.payload;
            // console.log('FIN setAvatar');
        },
    }
})

const { saveInfoUser, setAvatar, setToken } = userSlice.actions;

export { saveInfoUser, setAvatar, setToken };