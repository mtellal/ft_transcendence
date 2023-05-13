import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export class BackApi {

	static async getUserInfoById(id) {
		const response = await axios.get(`${BASE_URL}/users/${id}`)
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async authSignupUser(user, pass) {
		const response = await axios.post(`${BASE_URL}/auth/signup`, {
			username: user,
			password: pass
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async authSigninpUser(user, pass) {
		const response = await axios.post(`${BASE_URL}/auth/signin`, {
			username: user,
			password: pass
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async updateInfoProfile(id, userInfo) {
		const response = await axios.patch(`${BASE_URL}/users/${id}`, {
			...userInfo
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async updateProfilePicture(image, token) {
		console.log('token api ', token);
		const formData = new FormData();
		formData.append('file', image);
		return (
			axios.post(`${process.env.REACT_APP_BACK}/users/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', 
					'Authorization': `Bearer ${token}`
				}
			})
			.then(res => res)
			.catch(err => err)
		)
	}

	// static async updateAvatar(id, avatar, token) {
	// 	const formData = new FormData();
	// 	formData.append('file', avatar);

	// 	const response = await axios.patch(`${BASE_URL}/users/upload`, formData, {
	// 		headers: {
    //             'Content-Type': 'multipart/form-data', 
    //             'Authorization': `Bearer ${token}`
	// 		}
	// 	})
	// 	.then (rep => rep)
	// 	.catch (error => error)

	// 	return response;
	// }

	// static async updateAvatar(id, avatar) {
	// 	const response = await axios.post(`${BASE_URL}/users/${id}`, {
	// 		avatar: avatar,
	// 	})
	// 	.then (rep => rep)
	// 	.catch (error => error)

	// 	return response;
	// }
}