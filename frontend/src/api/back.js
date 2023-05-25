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
		formData.append('file', image, 'alpaga.jpg');
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

	// Uniquement pour les tests
	static async addFriendTest(id, idFriend) {
		return (
		  axios.post(`${BASE_URL}/users/friend`, {
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

	static async sendFriendRequest(idFriend, token) {
		return (
		  axios.post(`${BASE_URL}/users/friendRequest`, {
			id: idFriend,
		  }, {
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		  })
		  .then(res => res)
		  .catch(err => err)
		);
	}

	static async acceptFriendRequest(requestId, token) {
		return (
		  axios.post(`${BASE_URL}/users/friendRequest/${requestId}`, '', {
			headers: {
				'Accept': '*/*',
				'Authorization': `Bearer ${token}`
			}
		  })
		  .then(res => res)
		  .catch(err => err)
		);
	}

	static async removeFriendRequest(requestId, token) {
		return (
		  axios.delete(`${BASE_URL}/users/friendRequest/${requestId}`, {
			headers: {
				'Accept': '*/*',
				'Authorization': `Bearer ${token}`
			}
		  })
		  .then(res => res)
		  .catch(err => err)
		);
	}

	static async getFriendRequest(id) {
		const response = await axios.get(`${BASE_URL}/users/${id}/friendRequest`)
			.then(rep => rep)
			.catch(error => error)

		return response;
	}

	static async getFriendsById(id) {
		const response = await axios.get(`${BASE_URL}/users/${id}/friends`)
			.then(rep => rep)
			.catch(error => error)

		return response;
	}

	static async removeFriend(idFriend, token) {
		const response = await axios.delete(`${BASE_URL}/users/friend/${idFriend}`, {
			headers: {
			  'Accept': '*/*',
			//   'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
			}
		})
			.then(res => res)
			.catch(err => err)
		return response;
	}

	static async getWhispers(id, idFriend) {
		const response = await axios.get(`${BASE_URL}/users/whispers`, {
			params: {
				id: id,
				friendId: idFriend
			},
			headers: {
				'accept': '*/*'
			}
		})
			.then(rep => rep)
			.catch(error => error)

		return response;
	}
}