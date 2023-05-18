import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import s from './style.module.css'
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';
import { AddFriend } from '../../components/AddFriend/AddFriend';
import { Chatbox } from '../../components/Chatbot/Chatbot';

export function Chat() {

    const [friends, setFriends] = useState([]);
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

    useEffect(() => {
		if (selector.id) {
            getFriends();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.id])

    return (
        <div className={s.container}>
            <div className={s.item}>
                <AddFriend id={selector.id} addFriend={addFriend} />
                {friends.length > 0 ? <Friends friends={friends} delFriend={delFriend} /> : `Aucun ami a afficher :(`}
				<Chatbox />
            </div>
        </div>
    );
}