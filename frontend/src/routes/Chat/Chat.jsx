import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';
import { AddFriend } from '../../components/AddFriend/AddFriend';
import { Chatbox } from '../../components/Chatbot/Chatbot';
import s from './style.module.css'
import { FriendRequest } from '../../components/FriendRequest/FriendRequest';

export function Chat() {

    const [friends, setFriends] = useState([]);
    const [btnFriendsRequest, setBtnFriendsRequest] = useState(true);
	const [friendRequest, setFriendRequest] = useState([]);
    const selector = useSelector(store => store.USER.user);

    async function getFriends() {
        const response = await BackApi.getFriendsById(selector.id);

        if (response.status === 200) {
            if (response.data.length > 0) {
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
		setFriendRequest(response.data);
		console.log('API call Friend request')
	}

    useEffect(() => {
		if (selector.id) {
            getFriends();
			getFriendRequest();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.id])

    return (
        <div className={s.container}>
            <div className={s.item}>
				<button className={s.button} onClick={() => setBtnFriendsRequest(!btnFriendsRequest)}>{btnFriendsRequest ? 'List Friends' : 'Friend Request'}</button>
                <AddFriend id={selector.id} addFriend={addFriend} />
				{btnFriendsRequest && friendRequest.length > 0 && <FriendRequest listFriendRequest={friendRequest} />}
                {!btnFriendsRequest && <Friends friends={friends} delFriend={delFriend} />}
				<Chatbox />
            </div>
        </div>
    );
}