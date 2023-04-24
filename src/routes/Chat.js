import React from "react";

import '../styles/Chat.css'

import FriendElement from "../components/FriendElement";

import { examplesFriends, examplesGroup, exampleMessages } from "../exampleDatas";


function Message(props)
{

    function addStyle()
    {
        let obj;

        if (props.sender === "player1")
            obj = {backgroundColor: '#FFF5DD'};
        return (obj);
    }

    return (
        <div className="message-div"
            style={props.sender === "player1" ? {justifyContent: 'right'} : null}
        >
                <p
                    className="message"
                    style={addStyle()}
                >
                        {props.message}
                    </p>
        </div>
    )
}

function MessagesElement()
{

    const lastMessageRef = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [toggle, setToggle] = React.useState(false);

    function handleChange(e)
    {
        setValue(e.target.value)
    }

    function submitMessage()
    {
        if (value.length)
        {
            exampleMessages.push({
                id: exampleMessages + 1,
                sender: "player1",
                message: value
            });
        }
        setValue("");
        setToggle(prev => !prev)
    }

    function handleKeys(e)
    {
        if (e.key === "Enter")
        {
            submitMessage();
        }
    }

    const messages = exampleMessages.map((m, index) => {
        return (
            <Message 
                key={m.id}
                id={m.id}
                message={m.message} 
                sender={m.sender}
                prevSender={m > 0 ? m[index - 1].sender : m.sender}
            />
        )
    })

        React.useEffect(() => {
            lastMessageRef.current.scrollIntoView();
        }, [toggle])

    return (
        <div  className="messages-container">
            <div className="messages-display">
                {messages}
            </div>
            <div ref={lastMessageRef}></div>
            <div className="messages-input">
                <input
                    className="input"
                    value={value}
                    onChange={handleChange}
                    placeholder="Write your message"
                    onKeyDown={handleKeys}
                    />
            </div>
        </div>
    )
}

function CollectionElement(props)
{
    return (
        <div className="collection">
            <div className="collection-label">
                <h2 className="collection-title">{props.title}</h2>
                <div onClick={props.addClick} className="collection-add">
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </div>
            </div>
            <div className="collection-list">
                {props.collection}
            </div>
        </div>
    )
}

function GroupElement(props)
{
    return (
        <div className="group">
            <p className="group-name">{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.members} members</p>
        </div>
    )
}


function MenuElement(props)
{

    const [groups, setGroups] = React.useState(examplesGroup);
    const [friends, setFriends] = React.useState(examplesFriends);

    function handleFriendsMessage(p)
    {
        console.log(p)
    }

    const groupList = groups.map(e => 
        <GroupElement
            key={e.id}
            id={e.id}
            name={e.name}
            members={e.members}
        />
    )

    const friendsList = friends.map(e => (
        <FriendElement 
            key={e.id}
            id={e.id}
            username={e.username}
            connected={e.connected}
            chat={false}
            hover={true}
            className="chat"
            click={handleFriendsMessage}
        />
    ))

    return (
        <div className="menu-container">
            <CollectionElement
                title="Groups"
                collection={groupList}
                addClick={props.addGroup}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
                addClick={props.addFriend}
            />
        </div>
    )
}

function AddElement(props)
{
    const [value, setValue] = React.useState("");

    function handleChange(e)
    {
        setValue(e.target.value);
    }
    console.log("AddElement rendered")

    return (
        <div className="add-container">
            <div className="add-div">
                <h2 className="add-title">{props.title}</h2>
                <label htmlFor="input" className="search-input">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                <input
                    id="input"
                    className="add-input"
                    value={value}
                    onChange={handleChange}
                    />
                </label>
            </div>
        </div>
    )
}


export default function Chat()
{
    const [newFriend, setNewFriend] = React.useState(false);
    const [newGroup, setNewGroup] = React.useState(false);
    const [messagesDisplay, setMessagesDisplay] = React.useState(true);

    function addFriend()
    {
        console.log("addFriend");
        setMessagesDisplay(false)
        setNewFriend(true);
        setNewGroup(false)
    }

    function addGroup()
    {
        console.log("add group");
        setMessagesDisplay(prev => false)
        setNewGroup(true)
        setNewFriend(false)
    }

    return (
        <div className="chat">
            <div className="chat-container">
               <MenuElement
                addFriend={() => addFriend()}
                addGroup={() => addGroup()}
               />
                { messagesDisplay &&  <MessagesElement /> }
                { newFriend && <AddElement title="Add a friend" />}
                { newGroup && <AddElement title="Add a group" />}
            </div>
        </div>
    )
}