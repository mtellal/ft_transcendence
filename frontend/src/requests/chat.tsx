import axios from "axios";

const back = process.env.REACT_APP_BACK;

/////////////////////////////////////////////////////////////////////////
//                     C H A T        R E Q U E S T S                  //
/////////////////////////////////////////////////////////////////////////

export async function getChannel(id: number, token: string) {
    return (
        axios.get(`${back}/chat/${id}`, {
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
        axios.get(`${back}/users/whispers?id=${userId}&friendId=${friendId}`, {
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
        axios.post(`${back}/chat/`, {
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
        axios.get(`${back}/chat?name=${name}`, {
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
        axios.put(`${back}/chat`, channel, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    )
}

export async function getChannels(id: string | number, token: string) {
    return (
        axios.get(`${back}/users/${id}/channels`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res)
            .catch(err => err)
    )
}
