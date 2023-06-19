import axios from "axios";

const back = process.env.REACT_APP_BACK;

export async function enable2FARequest(enable: boolean, token: string)
{
    return (
        axios.put(`${back}/auth/twofactor?enable=${enable}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    )
} 

export async function getQRCodeRequest(token: string)
{
    return (
        axios.get(`${back}/auth/qrcode`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}