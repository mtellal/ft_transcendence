import axios from "axios";

const back = process.env.REACT_APP_BACK;

export async function getUser(id: number | string, token: string) {
    return (
        axios.get(`${back}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getUserByUsername(username: any, token: string) {
    return (
        axios.get(`${back}/users?username=${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function updateUser(user: any, id: number | string, token: string) {
    return (
        axios.patch(`${back}/users/${id}`, {
            ...user
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function login(user: any, token: string) {
    updateUser(
        { userStatus: "ONLINE" },
        user.id, 
        token
    )
}

export async function logout(user: any, token: string) {
    updateUser(
        { userStatus: "OFFLINE" },
        user.id,
        token
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


export async function getUserProfilePictrue(id: number | string, token: string) {
    return (
        axios.get(`${back}/users/${id}/profileImage`, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, )
            .then(res => res)
            .catch(err => err)
    )
}

export async function getMatchHistory(id: number | string, token: string) {
    return (
        axios.get(`${back}/users/${id}/matchHistory`, {
            headers: {
                'Accept': '*/*',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getAchievements(id: number | string, token: string) {
    return (
        axios.get(`${back}/users/${id}/achievements`, {
            headers: {
                'Accept': '*/*',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getStats(id: number | string, token: string) {
    return (
        axios.get(`${back}/users/${id}/stats`, {
            headers: {
                'Accept': '*/*',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getLadder(token: string) {
    return (
        axios.get(`${back}/users/ladder`, {
            headers: {
                'Accept': '*/*',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}