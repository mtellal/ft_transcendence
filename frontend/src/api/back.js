import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export class BackApi {

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
		// const response = await axios.patch(`${BASE_URL}/users/${id}`, {
		const response = await axios.patch(`${BASE_URL}/users/${id}`, {
			...userInfo
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}
}