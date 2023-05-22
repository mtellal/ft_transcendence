import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';
import { AddFriend } from '../../components/AddFriend/AddFriend';
import { Chatbox } from '../../components/Chatbot/Chatbot';
import { FriendRequest } from '../../components/FriendRequest/FriendRequest';
import io from 'socket.io-client'
import s from './style.module.css'

export function Chat() {

    const [friends, setFriends] = useState([]);
    const [friendRequest, setFriendRequest] = useState([]);
    const [btnFriendsRequest, setBtnFriendsRequest] = useState(true);
    const selector = useSelector(store => store.USER.user);



    const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);

    const send = (value) => {
        console.log('value:', value)
        console.log('id:', selector.id)
        socket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: 280,
        });
    }

    useEffect(() => {
        if (selector.token) {
            const newSocket = io('http://localhost:3000', {
                transports: ['websocket'],
                extraHeaders: {
                    'Authorization': `Bearer ${selector.token}`
                }
            })
            setSocket(newSocket);
        }
    }, [setSocket, selector.token])

    useEffect(() => {
        if (selector.id && socket) {
            if (selector.id === 1) {
                socket.emit('createChannel', {
                    name: "mp",
                    type: "WHISPER",
                    memberList: [2]
           })
        } else {
            socket.emit('joinChannel', {
                channelId: 200
            })
        }
    }
    }, [socket, selector.id])
    
      const messageListener = (message) => {
        console.log('MESSAGE', message);
        setMessages([...messages, message])
      }

      useEffect(() => {
          if (selector.id && socket) {
            console.log('okkkkkkkkkk');
            socket.on('message', messageListener);
            return () => {
                socket.off('message', messageListener)
            }
        }
      }, [messageListener])








      async function getFriends() {
        const response = await BackApi.getFriendsById(selector.id);

        if (response.status === 200) {
            if (response.data.length > 0 && friends !== response.data) {
				setFriends(response.data);
            }
        }
    }

	async function addFriend() {
        const response = await BackApi.getFriendsById(selector.id);
		setFriends(response.data);
	}

	function delFriend(delFriendId) {
		const updatedFriends = friends.filter((friend) => friend.id !== delFriendId);
		setFriends(updatedFriends);
	}

	async function getFriendRequest() {
		const response = await BackApi.getFriendRequest(selector.id);
        if (response.data !== friendRequest) {
            setFriendRequest(response.data);
        }
        // console.log('API call Friend request', response.data);
	}

    useEffect(() => {
        // console.log('1');
        if (selector.id) {
            // const interval = setInterval(() => {
            //     console.log('INTERVAL');
            //     getFriendRequest();
            // }, 10000)
            getFriendRequest();
            // return () => {
            //     clearInterval(interval);
            // };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.id])

    useEffect(() => {
        // console.log('2');
        if (selector.id) {
            getFriends();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.id, friendRequest])

    return (
        <div className={s.container}>
            <div className={s.item}>
				<button className={s.button} onClick={() => setBtnFriendsRequest(!btnFriendsRequest)}>{btnFriendsRequest ? 'List Friends' : 'Friend Request'}</button>
                <AddFriend id={selector.id} addFriend={addFriend} />
				{btnFriendsRequest && friendRequest && <FriendRequest listFriendRequest={friendRequest} setFriendRequest={setFriendRequest}/>}
                {!btnFriendsRequest && friends && <Friends friends={friends} delFriend={delFriend} />}
				<Chatbox send={send} />
            </div>
        </div>
    );
}