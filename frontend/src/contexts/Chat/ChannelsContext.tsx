import React, { createContext, useEffect, useReducer } from "react";
import { getChannels } from "../../utils/User";
import { useUser } from "../../Hooks";

export const ChannelsContext : React.Context<any> = createContext([]);

function reducer(channels : any, action : any)
{
    switch(action.type){
        case('setChannels'): {
            return (action.channels);
        }
        default: return (channels)
    }
}

export function ChannelsProvider({children} : any)
{
    const { user } = useUser();
    const [channels, dispatch] = useReducer(reducer, []);

    useEffect(() => {
        console.log("load channels");
        getChannels(user.id)
        .then(res => {
            console.log(res);
            if (res.status === 200 && res.statusText === "OK")
            {
                dispatch({type: 'setChannels', channels: res.data})
            }
        })

    }, [])
    
    return (
        <ChannelsContext.Provider value={[channels, dispatch]}>
            {children}
        </ChannelsContext.Provider>
    )
}