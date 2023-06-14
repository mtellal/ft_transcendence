export function createCookie(name: string, value: string) {
	document.cookie = name + "=" + value + "; SameSite=None; secure; path=/";
}

export function deleteCookie(name: string) {
	document.cookie = name + "=" + '; SameSite=None; secure; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
}

export function getCookieByName(name: string) {
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

export function parseJwt (token: string) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
}