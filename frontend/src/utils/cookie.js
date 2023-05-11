export function createCookie(name, value) {
	document.cookie = name + "=" + value + "; SameSite=None; secure; path=/";
}