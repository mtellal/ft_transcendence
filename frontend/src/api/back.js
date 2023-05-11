import axios from 'axios';

export class BackApi {

	static async authSignupUser(user, pass) {
		const response = await axios.post("http://localhost:3000/auth/signup", {
			username: user,
			password: pass
		})
		.then (rep => rep)
		.catch (error => error)

		return response;
	}
}