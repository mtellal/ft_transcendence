import axios from "axios";

export async function enable2FARequest(enable: boolean, token: string)
{
    return (
        axios.put(`${process.env.REACT_APP_BACK}/auth/twofactor?enable=${enable}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    )
} 

export async function getQRCodeRequest(token: string)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/auth/qrcode`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}