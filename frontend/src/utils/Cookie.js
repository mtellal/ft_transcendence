
export function setCookie(key, value)
{
    if (document.cookie)
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
    }
}

export function extractCookie(key)
{
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++)
  {
    if (cookies[i].substring(0, key.length) === key)
      return (cookies[i].substring(key.length + 1, cookies[i].length))
  }
  return (null)
}