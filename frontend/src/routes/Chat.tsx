import React from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import {
    getChannelByIDs,
    getFriendList,
    getMessages,
    getUserInvitations,
    removeUserFriend
} from "../utils/User";

import { io } from 'socket.io-client';

import './Chat.css'


function isEqual(value: any, other: any) {

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function (item1: any, item2: any) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};

export default function Chat() {

    const navigate = useNavigate();
    
    const { user, token }: any = useOutletContext();
    const [friends, setFriends]: [any, any] = React.useState()
    const [currentElement, setCurrentElement]: [any, any] = React.useState();
    const [socket, setSocket]: [any, any] = React.useState();

    const [conversations, setConversations]: [any, any] = React.useState([]);
    const [channel, setChannel]: [any, any] = React.useState();

    const [friendInvitations, setFriendInvitations] : [any, any] = React.useState([]);
    const [notifInvitation, setNotifInvitation] : [any, any] = React.useState(false);

    function newConversation(channel: any) {
        return (
            {
                ...channel,
                messages: []
            }
        )
    }

    async function loadCHannel() {
        const channelRes = await getChannelByIDs(user.id, currentElement.id);

        if (channelRes.status === 200 && channelRes.statusText === "OK") {
            setChannel(channelRes.data);
        }
        else {
            socket.emit('createChannel', {
                name: "privateMessage",
                type: "WHISPER",
                memberList: [currentElement.id]
            })
        }
    }


    React.useEffect(() => {
        if (currentElement)
            loadCHannel();
    }, [currentElement])


    React.useEffect(() => {
        if (channel) {
            if (!conversations.find((e: any) => e.id === channel.id)) {
                setConversations((p : any) => [...p, newConversation(channel)])
            }

            socket.emit('joinChannel', {
                channelId: channel.id,
            })

        }
    }, [socket, channel])


    function initMessages(arrayMessages : any)
    {
        setConversations((p : any) => 
            p.map((c : any, i : number) => {
                if (c.id === arrayMessages[0].channelId)
                {
                    c.messages = arrayMessages;
                }
                return (c);
            })
        )
    }


    function addMessage(message :any)
    {
        if (message.sendBy !== user.id && message.sendBy !== currentElement.id)
        {
            setFriends((p : any) => p.map((f : any) => {
                if (f.id === message.sendBy)
                {
                    if (!f.notifs)
                        f.notifs = 1;
                    else
                        f.notifs += 1;
                }
                return (f)
            }))
        }

        setConversations((p : any) => 
        p.map((c : any, i : number) => {
            if (c.id === message.channelId)
                c.messages = [...c.messages, message];
            return (c);
        })
    )
    }

    React.useEffect(() => {
        if (conversations && socket)
        {
            socket.on('message', (m: any) => {
                if (m.length) {
                    initMessages(m)
                }
                if (m.content) {
                    addMessage(m)
                }
            });
        }

        return () => {
            if (socket)
                socket.off('message');
        }
    }, [conversations, socket, channel])


    function sendMessage(channelId : any, content : any)
    {
        socket.emit('message', {
            channelId,
            content
        })
    }


    function removeFriendRequest(inviteId : any)
    {
        setNotifInvitation(false);
        setFriendInvitations((p : any) => p.filter((i : any) => i.id !== inviteId))
    }


    async function loadFriends() {
        const friendListRes = await getFriendList(user.id);
        if (friendListRes.status === 200 && friendListRes.statusText === "OK") {
            let friendList = friendListRes.data;
            friendList = friendList.sort((a: any, b: any) => a.username > b.username ? 1 : -1)
            setFriends((prev: any) => isEqual(prev, friendList) ? prev : friendList);
        }
    }

    /*
        if a friend exists inside friendList[] then it updates, 
        else he is added in the array 
    */

    function updateFriendList(friend: any) {
        if (friends && friends.find((p : any) => p.length && p.find((u : any) => u.id === friend.id)))
        {
            setFriends((p : any) => p.map((u : any) => {
                if (u.id === friend.id)
                {
                    return (friend)
                }
                return (u);
            }))
        }
        else
            setFriends([...friends, friend]);
    }

    async function removeFriend() {
        const res = await removeUserFriend(currentElement.id, token)
        if (res.status === 200 && res.statusText === "OK") {
            setFriends(friends.filter((u: any) => u.id !== currentElement.id))
            navigate("/chat");
        }
    }

    async function loadInvitations()
    {
        const invitationsRes = await getUserInvitations(user.id);
        if (invitationsRes.status === 200 && invitationsRes.statusText === "OK")
        {
            if (invitationsRes.data.length)
            {
                setFriendInvitations((p : any) => {
                    if (!isEqual(p, invitationsRes.data))
                    {
                        setNotifInvitation(true);
                        return (invitationsRes.data);
                    }
                    return (p);
                });
            }
        }
    }
     
    async function updateDatas()
    {
        loadInvitations();
        loadFriends();
    }

    React.useEffect(() => {
        updateDatas();
        const loadFriendsInterval = setInterval(updateDatas, 3000)

        let s = io('http://localhost:3000', {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });

        setSocket(s);

        return (() => {
            clearInterval(loadFriendsInterval);
            s.disconnect();
        })


    }, [])


    function selectCurrentElement(e : any)
    {
        setFriends((p : any) => p.map((f : any) => {
            if (e.id === f.id && f.notifs)
                f.notifs = 0;
            return (f);
        }));
        setCurrentElement({...e, notifs: 0});
    }

    return (
        <div className="chat">
            <div className="chat-container">
                <MenuElement
                    friends={friends}
                    user={user}
                    addGroup={() => { }}
                    setCurrentElement={selectCurrentElement}
                    notification={notifInvitation}
                    removeNotif={() => setNotifInvitation(false)}
                />
                <Outlet context={
                    {
                        user,
                        currentElement,
                        friends,
                        token,
                        removeFriend,
                        updateFriendList,
                        channel, 
                        conversations: conversations,
                        sendMessage,
                        friendInvitations,
                        removeFriendRequest
                    }
                }
                />
            </div>
        </div>
    )
}