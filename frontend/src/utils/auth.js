export function createCookie(name, value) {
	document.cookie = name + "=" + value + "; SameSite=None; secure; path=/";
}

export function getCookieByName(name) {
	name = name + "=";
	var list = document.cookie.split(';');
	for (var i = 0; i < list.length; i++) {
		var c = list[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return null;
}

export function parseJwt (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
}