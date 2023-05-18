import React from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { getChannelByIDs, getFriendList, getMessages, getUserFriends, removeUserFriend } from "../utils/User";

import { io } from 'socket.io-client';

import './Chat.css'


function isEqual(value : any, other : any) {

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
    var compare = function (item1 : any, item2 : any) {

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

export default function Chat()
{
    const {user, token} : any = useOutletContext();
    const [friends, setFriends] : [any, any] = React.useState()
    const [currentElement, setCurrentElement] : [any, any] = React.useState();
    const [socket, setSocket] : [any, any] = React.useState();

    const navigate = useNavigate();

    function getData(res : any)
    {
        if (res.status === 200 && res.statusText === "OK")
        {
            return (res.data)
        }
    }

    async function elementSelected(element : any)
    {
        setCurrentElement(element);

        const channelRes = await getChannelByIDs(user.id, element.id);

        if (channelRes.status === 200 && channelRes.statusText === "OK")
        {
            console.log("CHANNEL EXISTS ", channelRes.data);

            const messagesRes = await getMessages(channelRes.data.id);

            if (messagesRes.status === 200 && messagesRes.statusText === "OK")
            {
                console.log("MESSAGES EXISTS")
                console.log(messagesRes.data);
            }
            else
            {
                console.log("NO MESSAGES")
            }
        }
        else
        {    
            socket.emit('createChannel', {
                name: "privateMessage", 
                type: "WHISPER", 
                memberList: [element.id]
            })
            socket.on('createChannel', (e :any)  => console.log("CHANNEL CREATED ", e))
            console.log("CHANNEL CREATED")
        }

    }


    async function loadFriends()
    {
        const friendListRes = await getFriendList(user.id);
        let friendList = getData(friendListRes);
        friendList = friendList.sort((a : any, b : any) => a.username > b.username ? 1 : -1)
        setFriends((prev : any) => isEqual(prev, friendList) ? prev : friendList);
    }

    function addGroup()
    {
        console.log("add group");
    }

    function updateFriendList(friend : any)
    {
        setFriends([...friends, friend]);
    } 

    async function removeFriend()
    {
        const res = await removeUserFriend(user.id, currentElement.id)
        if (res.status === 200 && res.statusText === "OK")
        {
            setFriends(friends.filter((u : any) => u.id !== currentElement.id))
            navigate("/chat");
        }
    }

    React.useEffect(() => {
        loadFriends()
        const loadFriendsInterval = setInterval(loadFriends, 3000)

        let s = io('http://localhost:3000', {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization':`Bearer ${token}`
            }
        });
        
        setSocket(s);

        return (() => {
            clearInterval(loadFriendsInterval);
            s.disconnect();
        })


    }, [])

    return (
        <div className="chat">
            <div className="chat-container">
               <MenuElement
                friends={friends}
                user={user}
                addGroup={() => addGroup()}
                setCurrentElement={elementSelected}
               />
                <Outlet context={
                    {
                        user, 
                        currentElement, 
                        friends, 
                        token,
                        removeFriend,
                        updateFriendList,
                        socket
                    }
                } 
                />
            </div>
        </div>
    )
}