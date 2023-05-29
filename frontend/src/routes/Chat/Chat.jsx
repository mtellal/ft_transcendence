import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';
import { AddFriend } from '../../components/AddFriend/AddFriend';
import { Chatbox } from '../../components/Chatbox/Chatbox';
import { FriendRequest } from '../../components/FriendRequest/FriendRequest';
import { Group } from '../../components/Group/Group';
import { ChatboxChannel } from '../../components/ChatboxChannel/ChatboxChannel';
import { CreateGroup } from '../../components/CreateGroup/CreateGroup';
import s from './style.module.css'
import { JoinChannel } from '../../components/JoinChannel/JoinChannel';

export function Chat() {

	const [friends, setFriends] = useState([]);
	const [myChannels, setMyChannels] = useState([]);
	const [friendRequest, setFriendRequest] = useState([]);
	const [idFriendSelected, setIdFriendSelected] = useState();
	const [btnFriendsRequest, setBtnFriendsRequest] = useState('CREATE_GROUP');
	const selector = useSelector(store => store.USER.user);

	async function getFriends() {
		const response = await BackApi.getFriendsById(selector.id);
		if (response.status === 200) {
			if (response.data.length > 0 && friends !== response.data) {
				setFriends(response.data);
			}
		}
	}

	async function getUserChannels() {
		const response = await BackApi.getChannelsByUserId(selector.id);
		if (response.status === 200) {
			if (response.data.length > 0 && myChannels !== response.data) {
				setMyChannels(response.data);
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
			console.log('refresh');
			setFriendRequest(response.data);
		}
	}

	useEffect(() => {
		if (selector.id) {
			// const interval = setInterval(() => {
			// console.log('INTERVAL');
			// getFriendRequest();
			// }, 3000)
			getFriendRequest();
			// return () => {
			// clearInterval(interval);
			// };
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selector.id])

	useEffect(() => {
		// console.log('2');
		if (selector.id) {
			getFriends();
			getUserChannels();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selector.id, friendRequest])

	return (
		<div className={s.container}>
			<div className={s.item}>
				<div className={s.menu}>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('REQUEST')}
						style={{ backgroundColor: btnFriendsRequest === 'REQUEST' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}
					>
						Friend Request
					</button>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('FRIEND')}
						style={{ backgroundColor: btnFriendsRequest === 'FRIEND' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}
					>
						Friend List
					</button>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('GROUP')}
						style={{backgroundColor: btnFriendsRequest === 'GROUP' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
					>
						My channels
					</button>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('CREATE_GROUP')}
						style={{backgroundColor: btnFriendsRequest === 'CREATE_GROUP' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
					>
						Create channel
					</button>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('JOIN_GROUP')}
						style={{backgroundColor: btnFriendsRequest === 'JOIN_GROUP' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
					>
						Join channel
					</button>
					<AddFriend id={selector.id} addFriend={addFriend} />
				</div>
				{btnFriendsRequest === 'REQUEST' && friendRequest && <FriendRequest listFriendRequest={friendRequest} setFriendRequest={setFriendRequest} />}
				{btnFriendsRequest === 'FRIEND' && friends && <Friends friends={friends} delFriend={delFriend} setIdFriendSelected={setIdFriendSelected} />}
				{btnFriendsRequest === 'GROUP' && myChannels && <Group myChannels={myChannels} setIdFriendSelected={setIdFriendSelected} />}
				{btnFriendsRequest === 'CREATE_GROUP' && myChannels && <CreateGroup />}
				{btnFriendsRequest === 'JOIN_GROUP' && myChannels && <JoinChannel myChannels={myChannels} />}
				{idFriendSelected && btnFriendsRequest !== 'GROUP' && btnFriendsRequest !== 'CREATE_GROUP' && btnFriendsRequest !== 'JOIN_GROUP' && <Chatbox idFriendSelected={idFriendSelected} />}
				{idFriendSelected && btnFriendsRequest === 'GROUP' && <ChatboxChannel idFriendSelected={idFriendSelected} />}
			</div>
		</div>
	);
}