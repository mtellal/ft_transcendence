import axios from "axios";

export async function removeUserFriend(friendId: number | string, token: number | string) {
    return (
        axios.delete(`${process.env.REACT_APP_BACK}/users/friend/${friendId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}