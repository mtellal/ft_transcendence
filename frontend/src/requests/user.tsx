import axios from "axios";

const back = process.env.REACT_APP_BACK;

export async function getUser(id: number | string) {
    return (
        axios.get(`${back}/users/${id}`)
            .then(res => res)
            .catch(err => err)
    )
}

export async function getUserByUsername(username: any) {
    return (
        axios.get(`${back}/users?username=${username}`)
            .then(res => res)
            .catch(err => err)
    )
}

export async function updateUser(user: any, id: number | string) {
    return (
        axios.patch(`${back}/users/${id}`, {
            ...user
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function login(user: any) {
    updateUser(
        { userStatus: "ONLINE" },
        user.id
    )
}

export async function logout(user: any) {
    updateUser(
        { userStatus: "OFFLINE" },
        user.id
    )
}

export async function updateProfilePicture(image: any, token: string) {
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


export async function getUserProfilePictrue(id: number | string) {
    return (
        axios.get(`${back}/users/${id}/profileImage`, {
            responseType: 'arraybuffer'
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getMatchHistory(id: number | string) {
    return (
        axios.get(`${back}/users/${id}/matchHistory`, {
            headers: {
                'Accept': '*/*'
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}