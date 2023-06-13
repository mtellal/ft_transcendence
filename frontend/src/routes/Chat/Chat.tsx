import React from 'react';
import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';
import { AddFriend } from '../../components/AddFriend/AddFriend';
import { Chatbox } from '../../components/Chatbox/Chatbox';
import { FriendRequest } from '../../components/FriendRequest/FriendRequest';
import { Channels } from '../../components/Channels/Channels';
import { ChatboxChannel } from '../../components/ChatboxChannel/ChatboxChannel';
import { CreateChannel } from '../../components/CreateChannel/CreateChannel';
import { JoinChannel } from '../../components/JoinChannel/JoinChannel';
import { RootState } from '../../store';
import s from './style.module.css'

/* 
	direct envent :
		- Quand on accepte une demande d'ami.



		pour les amis t'as: 
	updatedUser qui renvoie un ami,  si A ajoute B, alors B recoit A, +
		update les infos (example profile picture, status online etc..)
	removedFriend qui renvoie l'ami qui t'as suppr, A suppr B, B recoit A
*/

export function Chat() {

	// const [friends, setFriends] = useState([]);
	const [myChannels, setMyChannels] = useState([]);
	const [idFriendSelected, setIdFriendSelected] = useState();
	const [idChannelSelected, setidChannelSelected] = useState();
	const [btnFriendsRequest, setBtnFriendsRequest] = useState('CREATE_CHANNEL');
	const selector = useSelector((store: RootState) => store.user.user);

	// async function getFriends() {
	// 	const response = await BackApi.getFriendsById(selector.id);
	// 	if (response.status === 200) {
	// 		if (response.data.length > 0 && friends !== response.data) {
	// 			setFriends(response.data);
	// 		}
	// 	}
	// }

	async function getUserChannels() {
		const response = await BackApi.getChannelsByUserId(selector.id);
		if (response.status === 200) {
			setMyChannels(response.data);
		}
	}

	async function addFriend() {
		console.log('Ami ajoute');
		// const response = await BackApi.getFriendsById(selector.id);
		// setFriends(response.data);
	}

	// function delFriend(delFriendId: number) {
	// 	const updatedFriends = friends.filter((friend) => friend.id !== delFriendId);
	// 	setFriends(updatedFriends);
	// }

	useEffect(() => {
		if (selector.id) {
			// getFriends();
			getUserChannels();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selector.id, idChannelSelected])

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
						onClick={() => setBtnFriendsRequest('CHANNEL')}
						style={{backgroundColor: btnFriendsRequest === 'CHANNEL' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
					>
						My channels
					</button>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('CREATE_CHANNEL')}
						style={{backgroundColor: btnFriendsRequest === 'CREATE_CHANNEL' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
					>
						Create channel
					</button>
					<button
						className={s.button}
						onClick={() => setBtnFriendsRequest('JOIN_CHANNEL')}
						style={{backgroundColor: btnFriendsRequest === 'JOIN_CHANNEL' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}
					>
						Join channel
					</button>
					<AddFriend addFriend={addFriend} />
				</div>
				{/* {btnFriendsRequest === 'REQUEST' && friendRequest && <FriendRequest listFriendRequest={friendRequest} setFriendRequest={setFriendRequest} />} */}
				{btnFriendsRequest === 'REQUEST' && <FriendRequest id={selector.id} />}
				{btnFriendsRequest === 'FRIEND' && <Friends id={selector.id} setIdFriendSelected={setIdFriendSelected} />}
				{btnFriendsRequest === 'CHANNEL' && myChannels && <Channels idChannelSelected={idChannelSelected} setidChannelSelected={setidChannelSelected} id={selector.id} />}
				{btnFriendsRequest === 'CREATE_CHANNEL' && myChannels && <CreateChannel setBtnFriendsRequest={setBtnFriendsRequest}/>}
				{btnFriendsRequest === 'JOIN_CHANNEL' && myChannels && selector.id && <JoinChannel id={selector.id}/>}
				{idFriendSelected && btnFriendsRequest !== 'CHANNEL' && btnFriendsRequest !== 'CREATE_CHANNEL' && btnFriendsRequest !== 'JOIN_CHANNEL' && <Chatbox idFriendSelected={idFriendSelected} />}
				{idChannelSelected && btnFriendsRequest === 'CHANNEL' && <ChatboxChannel myChannels={myChannels} setMyChannels={setMyChannels} idChannelSelected={idChannelSelected} setidChannelSelected={setidChannelSelected}/>}
			</div>
		</div>
	);
}