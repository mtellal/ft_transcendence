

export function setCookie(key: string, value: string) {
    console.log("set cookie called: ", "[", key, "]", "[", value, "]")
    document.cookie = `${key}=${value}`;
    /* if (document.cookie)
    {
        const cookies = document.cookie.split("; ");
        const index = cookies.findIndex(c => c.startsWith(key + "="))
        if (index !== -1)
        {
            cookies[index] = `${key}=${value}`;
            document.cookie = cookies.join("; ");
        }
    }
    else
    {
        document.cookie += `${key}=${value}`
    } */
}

export function extractCookie(key: string) {
    let cookies = document.cookie.split("=");
    if (cookies[1])
        return (cookies[1]);
    return (null)
}