import axios from "axios";

const back = process.env.REACT_APP_BACK;

/*
    ask to login a user and 
    return a http response 
*/

export async function signinRequest(username : string, password : string)
{
    return (axios.post(`${back}/auth/signin`, {
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

export async function signupRequest(username : string, password : string)
{
    return (axios.post(`${back}/auth/signup`, {
            username, 
            password
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUser(id : number | string)
{
    return (
        axios.get(`${back}/users/${id}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUserByUsername(username : any )
{
    return (
        axios.get(`${back}/users?username=${username}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateUser(user : any, id : number | string)
{
    return (
        axios.patch(`${back}/users/${id}`, {
            ...user
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateProfilePicture(image : any , token : string)
{
    const formData = new FormData();
    formData.append('file', image);
    return (
        axios.post(`${back}/users/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res)
        .catch(err => err)
    )
}


export async function getUserProfilePictrue(id : number | string)
{
    return (
        axios.get(`${back}/users/${id}/profileImage`, {
            responseType:'arraybuffer'
        })
        .then(res => res)
        .catch(err => err)
    )
}



export async function getFriendList(id :  number | string)
{
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

export async function getUserFriends(friendIDs :  any)
{
    return (await Promise.all(friendIDs.map(async (id : any) => await getUser(id))))
}

export async function addUserFriend(id : number | string, friendId : number | string)
{
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

export async function removeUserFriend(id : number | string, friendId : number | string)
{
    return (
        axios.delete(`${back}/users/friend`, 
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
        axios.get(`${back}/chats`)
        .then(res => res)
        .catch(err => err)
    )
}



export async function getChannelByIDs(id : string | number, friendId : string | number)
{
    return (
        axios.get(`${back}/users/whispers?id=${id}&friendId=${friendId}`)
        .then(res => res)
        .catch(err => err)
    )
}


export async function getMessages(channelId : string | number)
{
    return (
        axios.get(`${back}/chat/${channelId}/messages`)
        .then(res => res)
        .catch(err => err)
    )
}