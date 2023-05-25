import React, { createContext, useReducer } from "react";


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
    console.log("Conversations reducer called");
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
                            /* if (currentUser && currentUser.blockedList.length && 
                                    currentUser.blockedList.find((id :any) => id === arrayMessages[0].channeId))
                                    return (c); */
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