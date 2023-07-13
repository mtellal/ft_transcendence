import axios from "axios";

/////////////////////////////////////////////////////////////////////////
//                     C H A T        R E Q U E S T S                  //
/////////////////////////////////////////////////////////////////////////


export async function getAllChannels(token: string)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/chat`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

    )
}

export async function getChannel(id: number, token: string) {
    return (
        axios.get(`${process.env.REACT_APP_BACK}/chat/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getWhisperChannel(userId: number, friendId: number, token: string) {
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/whispers?id=${userId}&friendId=${friendId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function getChannelProtected(channelId: number, password: string, token: string) {
    return (
        axios.post(`${process.env.REACT_APP_BACK}/chat/`, {
            channelId,
            password
        },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(res => res)
            .catch(err => err)
    )
}

export async function getChannelByName(name: string, token: string) {
    return (
        axios.get(`${process.env.REACT_APP_BACK}/chat?name=${name}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

export async function createChannel(channel: any, token: number | string) {
    return (
        axios.put(`${process.env.REACT_APP_BACK}/chat`, channel, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function getChannels(id: string | number, token: string) {
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/channels`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}



export async function deleteChannelRequest(id: string | number, token: string) {
    return (
        axios.delete(`${process.env.REACT_APP_BACK}/chat/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}

