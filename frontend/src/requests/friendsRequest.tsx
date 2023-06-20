import axios from "axios";

const back = process.env.REACT_APP_BACK;

/////////////////////////////////////////////////////////////////////////
//                     F R I E N D    R E Q U E S T S                  //
/////////////////////////////////////////////////////////////////////////


export async function getUserInvitations(id: number | string) {
    return (
        axios.get(`${back}/users/${id}/friendRequest`)
            .then(res => res)
            .catch(err => err)
    )
}

export async function sendFriendRequest(friendId: number | string, token: string) {
    return (
        axios.post(`${back}/users/friendRequest`, {
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
        axios.post(`${back}/users/friendRequest/${requestId}`, {}, {
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
        axios.delete(`${back}/users/friendRequest/${requestId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}
