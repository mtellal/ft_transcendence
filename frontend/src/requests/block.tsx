import axios from "axios";

const back = process.env.REACT_APP_BACK;

/////////////////////////////////////////////////////////////////////////
//                     B L O C K     R E Q U E S T S                   //
/////////////////////////////////////////////////////////////////////////

export async function getBlockedList(id: number | string, token: string) {
    return (
        axios.get(`${back}/users/${id}/blockList`)
            .then(res => res)
            .catch(err => err)
    )
}

export async function blockUserRequest(id: number | string, token: number | string) {
    return (
        axios.post(`${back}/users/block/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function unblockUserRequest(id: number | string, token: number | string) {
    return (
        axios.delete(`${back}/users/block/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}
