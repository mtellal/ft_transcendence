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

	static async getProfilePictureById(id) {
		// console.log('ID', id);
		const response = await axios.get(`${BASE_URL}/users/${id}/profileImage`, {
            responseType:'arraybuffer'
        })
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async updateProfilePicture(image, token) {
		const formData = new FormData();
		formData.append('file', image, 'avatar.jpg');
		// console.log('FORMMMMMMM', image);

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

	static async getFriendsById(id) {
		const response = await axios.get(`${BASE_URL}/users/${id}/friends`)
			.then(rep => rep)
			.catch(error => error)

		return response;
	}
}