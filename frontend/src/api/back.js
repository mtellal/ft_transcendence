import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export class BackApi {

	static async getAllUsers() {
		const response = await axios.get(`${BASE_URL}/users`)
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

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
		const response = await axios.get(`${BASE_URL}/users/${id}/profileImage`, {
            responseType:'arraybuffer'
        })
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async updateProfilePicture(image, token) {

		const formData = new FormData();
		formData.append('file', image);

		return (
			axios.post(`${BASE_URL}/users/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', 
					'Authorization': `Bearer ${token}`
				}
			})
			.then(res => res)
			.catch(err => err)
		)
	}

	static async addFriend(id, idFriend) {
		return (
		  axios.post('http://localhost:3000/users/friend', {
			id: id,
			friendId: idFriend
		  }, {
			headers: {
			  'Accept': '*/*',
			  'Content-Type': 'application/json'
			}
		  })
		  .then(res => res)
		  .catch(err => err)
		);
	  }
	  

	static async getFriendsById(id) {
		const response = await axios.get(`${BASE_URL}/users/${id}/friends`)
			.then(rep => rep)
			.catch(error => error)

		return response;
	}

	static async removeFriend(id, idFriend) {
		const response = await axios.delete(`${BASE_URL}/users/friend`, {
			data: {
				id: id,
				friendId: idFriend
			}
		  }, {
			headers: {
			  'Accept': '*/*',
			  'Content-Type': 'application/json'
			}
		})
			.then(res => res)
			.catch(err => err)
		return response;
	}
}