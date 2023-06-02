import axios from "axios";
import { getUser } from "../requests/user";

const back = process.env.REACT_APP_BACK;


export async function getFriendList(id: number | string) {
    return (
        axios.get(`${back}/users/${id}/friends`)
            .then(res => res)
            .catch(err => err)
    )
}

/*
    - friendIDs a array of id [1,2,3,4]
    - return an array of users [{id:.., username:.., ...}] 
*/

export async function getUserFriends(friendIDs: any) {
    return (await Promise.all(friendIDs.map(async (id: any) => await getUser(id))))
}

export async function addUserFriend(id: number | string, friendId: number | string) {
    return (
        axios.post(`${back}/users/friend`, {
            id,
            friendId
        })
            .then(res => res)
            .catch(err => err)
    )
}

/*
    Not a good practice to user DELETE with a body, (need to be wrapped in data object)
    prefer datas in URI
*/

export async function removeUserFriend(friendId: number | string, token: number | string) {
    return (
        axios.delete(`${back}/users/friend/${friendId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}