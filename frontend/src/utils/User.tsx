import axios from "axios";

/*
    ask to login a user and 
    return a http response 
*/

export async function signinRequest(username, password)
{
    return (axios.post(`${process.env.REACT_APP_BACK}/auth/signin`, {
            username, 
            password
        })
        .then(res => res)
        .catch(err => err)
    )
}

/*
    ask to create a user and 
    return a http response 
*/

export async function signupRequest(username, password)
{
    return (axios.post(`${process.env.REACT_APP_BACK}/auth/signup`, {
            username, 
            password
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUser(id)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUserByUsername(username)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users?username=${username}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateUser(user, id)
{
    return (
        axios.patch(`${process.env.REACT_APP_BACK}/users/${id}`, {
            ...user
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateProfilePicture(image, token)
{
    const formData = new FormData();
    formData.append('file', image);
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res)
        .catch(err => err)
    )
}


export async function getUserProfilePictrue(id)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/profileImage`, {
            responseType:'arraybuffer'
        })
        .then(res => res)
        .catch(err => err)
    )
}



export async function getFriendList(id)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/friends`)
        .then(res => res)
        .catch(err => err)
    )
} 

/*
    - friendIDs a array of id [1,2,3,4]
    - return an array of users [{id:.., username:.., ...}] 
*/

export async function getUserFriends(friendIDs)
{
    return (await Promise.all(friendIDs.map(async (id) => await getUser(id))))
}

export async function addUserFriend(id, friendId)
{
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/friend`, {
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

export async function removeUserFriend(id, friendId)
{
    return (
        axios.delete(`${process.env.REACT_APP_BACK}/users/friend`, 
        {
            data: {
                id,
                friendId
            }
        })
        .then(res => res)
        .catch(err => err)
    )
} 


/*
    get all chats from backend 
*/

export async function getChats()
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/chats`)
        .then(res => res)
        .catch(err => err)
    )
}