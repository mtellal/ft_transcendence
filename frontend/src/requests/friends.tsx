import axios from "axios";
import { getUser } from "../requests/user";

const back = process.env.REACT_APP_BACK;


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