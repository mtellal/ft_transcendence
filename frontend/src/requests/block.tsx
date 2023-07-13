import axios from "axios";


/////////////////////////////////////////////////////////////////////////
//                     B L O C K     R E Q U E S T S                   //
/////////////////////////////////////////////////////////////////////////

export async function getBlockList(id: number | string, token: string) {
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/blockList`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function blockUserRequest(id: number | string, token: number | string) {
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/block/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function unblockUserRequest(id: number | string, token: number | string) {
    return (
        axios.delete(`${process.env.REACT_APP_BACK}/users/block/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}
