import React from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { getFriendList, getUserFriends, removeUserFriend } from "../utils/User";

import { io } from 'socket.io-client';

import './Chat.css'



function isEqual(value, other) {

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
    var compare = function (item1, item2) {

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

export default function Chat(props)
{
    const {user, token} : any = useOutletContext();
    const [friends, setFriends] : [any, any] = React.useState()
    const [currentElement, setCurrentElement] : [any, any] = React.useState();
    const [socket, setSocket] : [any, any] = React.useState();

    const navigate = useNavigate();

    function getData(res)
    {
        if (res.status === 200 && res.statusText === "OK")
        {
            return (res.data)
        }
    }

    function elementSelected(element)
    {
        console.log("elementSelected", user);
        setCurrentElement(element);

        socket.emit('createChannel', {name: "testMembers", type: "PUBLIC", members: [1, 2, 3]})

        socket.on('createChannel', e => console.log(e))

    }


    async function loadFriends()
    {
        const friendListRes = await getFriendList(user.id);
        let friendList = getData(friendListRes);
        friendList = friendList.sort((a,b) => a.username > b.username ? 1 : -1)
        setFriends(prev => isEqual(prev, friendList) ? prev : friendList);
    }

    function addGroup()
    {
        console.log("add group");
    }

    function updateFriendList(friend)
    {
        setFriends([...friends, friend]);
    } 

    async function removeFriend()
    {
        const res = await removeUserFriend(user.id, currentElement.id)
        if (res.status === 200 && res.statusText === "OK")
        {
            setFriends(friends.filter(u => u.id !== currentElement.id))
            navigate("/chat");
        }
    }

    React.useEffect(() => {
        loadFriends()
        const loadFriendsInterval = setInterval(loadFriends, 3000)

        setSocket(io('http://localhost:3000', {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization':`Bearer ${token}`
            }
        }));


        return (() => {
            clearInterval(loadFriendsInterval);
            socket.disconnect();
        })


    }, [])

    return (
        <div className="chat">
            <div className="chat-container">
               <MenuElement
                friends={friends}
                user={props.user}
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