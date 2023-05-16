import axios from "axios";

/*
    ask to login a user and 
    return a http response 
*/

export async function signinRequest(username : string, password : string)
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

export async function signupRequest(username : string, password : string)
{
    return (axios.post(`${process.env.REACT_APP_BACK}/auth/signup`, {
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
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUserByUsername(username : any )
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users?username=${username}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateUser(user : any, id : number | string)
{
    return (
        axios.patch(`${process.env.REACT_APP_BACK}/users/${id}`, {
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


export async function getUserProfilePictrue(id : number | string)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/profileImage`, {
            responseType:'arraybuffer'
        })
        .then(res => res)
        .catch(err => err)
    )
}



export async function getFriendList(id :  number | string)
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

export async function getUserFriends(friendIDs :  any)
{
    return (await Promise.all(friendIDs.map(async (id : any) => await getUser(id))))
}

export async function addUserFriend(id : number | string, friendId : number | string)
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

export async function removeUserFriend(id : number | string, friendId : number | string)
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