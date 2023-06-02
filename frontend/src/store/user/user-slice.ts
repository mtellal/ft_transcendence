// import { createSlice } from "@reduxjs/toolkit";

// export const userSlice = createSlice({
//     name: "userSlice",
//     initialState: {
//         user: {
//             id: "",
//             username: "",
//             status: "",
//             avatar: "",
//             token: "",
//         },
//     },
//     reducers: {
//         saveInfoUser: (currentSlice, action) => {
//             currentSlice.user.id = action.payload.id;
//             currentSlice.user.username = action.payload.username;
//             currentSlice.user.status = action.payload.userStatus;
//             currentSlice.user.avatar = action.payload.avatar;
//         },
//         setToken: (currentSlice, action) => {
//             currentSlice.user.token = action.payload;
//         },
//         setAvatar: (currentSlice, action) => {
//             currentSlice.user.avatar = action.payload;
//         },
//     }
// })

// const { saveInfoUser, setAvatar, setToken } = userSlice.actions;

// export { saveInfoUser, setAvatar, setToken };


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	user: {
		id: number;
		username: string;
		status: string;
		avatar: string;
		token: string;
	};
}

const initialState: UserState = {
	user: {
		id: 0,
		username: "",
		status: "",
		avatar: "",
		token: "",
	},
};

const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		saveInfoUser: (currentSlice, action: PayloadAction<{
			id: number;
			username: string;
			userStatus: string;
			avatar: string;
		}>) => {
			currentSlice.user.id = action.payload.id;
			currentSlice.user.username = action.payload.username;
			currentSlice.user.status = action.payload.userStatus;
			currentSlice.user.avatar = action.payload.avatar;
		},
		setToken: (currentSlice, action: PayloadAction<string>) => {
			currentSlice.user.token = action.payload;
		},
		setAvatar: (currentSlice, action: PayloadAction<string>) => {
			currentSlice.user.avatar = action.payload;
		},
	},
});

const { saveInfoUser, setAvatar, setToken } = userSlice.actions;

export { saveInfoUser, setAvatar, setToken };
export default userSlice.reducer;