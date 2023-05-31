import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export class BackApi {
	
	static async getAllUsers() {
		const response = await axios.get(`${BASE_URL}/users`)
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async getUserByUsername(username: string) {
		const response = await axios.get(`${BASE_URL}/users`, {
			params: {
				username: username,
			},
			headers: {
				'accept': '*/*'
			}
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async getUserInfoById(id: number) {
		const response = await axios.get(`${BASE_URL}/users/${id}`)
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async authSignupUser(user: string, pass: string) {
		const response = await axios.post(`${BASE_URL}/auth/signup`, {
			username: user,
			password: pass
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async authSigninpUser(user: string, pass: string) {
		const response = await axios.post(`${BASE_URL}/auth/signin`, {
			username: user,
			password: pass
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async updateInfoProfile(id: number, userInfo: any) {
		const response = await axios.patch(`${BASE_URL}/users/${id}`, {
			...userInfo
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async getProfilePictureById(id: number) {
		const response = await axios.get(`${BASE_URL}/users/${id}/profileImage`, {
			responseType:'arraybuffer'
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}

	static async updateProfilePicture(image: any, token: string) {
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
	static async addFriendTest(id: number, idFriend: number) {
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

	static async sendFriendRequest(idFriend: number, token: string) {
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

	static async acceptFriendRequest(requestId: number, token: string) {
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

	static async removeFriendRequest(requestId: number, token: string) {
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

	static async getFriendRequest(id: number) {
		const response = await axios.get(`${BASE_URL}/users/${id}/friendRequest`)
			.then(rep => rep)
			.catch(error => error)

		return response;
	}

	static async getFriendsById(id: number) {
		const response = await axios.get(`${BASE_URL}/users/${id}/friends`)
			.then(rep => rep)
			.catch(error => error)

		return response;
	}

	static async removeFriend(idFriend: number, token: string) {
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

	static async getWhispers(id: number, idFriend: number) {
		// console.log('id select friend', idFriend);

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

	static async getChannelsByUserId(idUser: number) {
		const response = await axios.get(`${BASE_URL}/users/${idUser}/channels`, {
			headers: {
				'accept': '*/*'
			}
		})
			.then(rep => rep)
			.catch(error => error)

		return response;
	}

	static async getAllChannels() {
		const response = await axios.get(`${BASE_URL}/chat`, {
			headers: {
				'accept': '*/*'
			}
		})
			.then(rep => rep)
			.catch(error => error)

		return response;
	}
}