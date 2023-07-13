import axios from "axios";

/////////////////////////////////////////////////////////////////////////
//                     F R I E N D    R E Q U E S T S                  //
/////////////////////////////////////////////////////////////////////////


export async function getUserInvitations(id: number | string, token: string) {
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/friendRequest`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function sendFriendRequest(friendId: number | string, token: string) {
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/friendRequest`, {
            id: friendId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function validFriendRequest(requestId: number | string, token: number | string) {
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/friendRequest/${requestId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function refuseFriendRequest(requestId: number | string, token: number | string) {
    return (
        axios.delete(`${process.env.REACT_APP_BACK}/users/friendRequest/${requestId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}
