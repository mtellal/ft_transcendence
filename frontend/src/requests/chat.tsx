import axios from "axios";

const back = process.env.REACT_APP_BACK;

/////////////////////////////////////////////////////////////////////////
//                     C H A T        R E Q U E S T S                  //
/////////////////////////////////////////////////////////////////////////

export async function getChannel(id: number) {
    return (
        axios.get(`${back}/chat/${id}`)
            .then(res => res)
            .catch(err => err)
    )
}

export async function getChannelByName(name: string) {
    return (
        axios.get(`${back}/chat?name=${name}`)
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

export async function getChannels(id: string | number) {
    return (
        axios.get(`${back}/users/${id}/channels`)
            .then(res => res)
            .catch(err => err)
    )
}

export async function removeChannel(id: number) {
    return (
        axios.delete(`${back}/chat/${id}`)
            .then(res => res)
            .catch(err => err)
    )
}