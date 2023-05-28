import React, { createContext, useEffect, useReducer } from "react";


export const ConversationsContext : React.Context<any> = createContext([]);

function newConversation(channel: any) {
    return (
        {
            ...channel,
            messages: []
        }
    )
}

function reducer(conversations : any, action : any) {
    switch(action.type) {
        case('addConv'): {
            return ([...conversations, newConversation(action.conversation)])
        }
        case('initMessages'): {
            const messages = action.messages;
            return (
                    conversations.map((c: any) => {
                        if (c.id === messages[0].channelId)
                        {
                            c.messages = messages;                    
                        }
                        return (c);
                    })
            )
        }
        case('addMessage'): {
            const message = action.message;
            return (
                conversations.map((c: any, i: number) => {
                    if (c.id === message.channelId)
                        c.messages = [...c.messages, message];
                    return (c);
                })
            )
        }
        default: return (conversations)
    }
}


export function ConversationsProvider({children} : any)
{
    const [conversations, dispatch] : any = useReducer(reducer, []);


    
    return (
        <ConversationsContext.Provider value={[conversations, dispatch]}>
            {children}
        </ConversationsContext.Provider>
    )
}