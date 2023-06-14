import React, { useEffect, useState } from "react";
import { FriendRequestList } from "../FriendRequestList/FriendRequestList";
import { getSocket } from "../../utils/socket";
import { BackApi } from "../../api/back";
import { BlockedUsersList } from "../BlockedUsersList/BlockedUsersList";

interface FriendRequestProps {
	id: number;
}

export function FriendRequest({ id }: FriendRequestProps) {

	const [socket, setSocket] = useState(null);
	const [listFriendRequest, setFriendRequest] = useState([]);
	const [listBlockUsers, setListBlockUsers] = useState([]);

	async function getFriendRequest() {
		const response = await BackApi.getFriendRequest(id);
		if (response.data !== listFriendRequest) {
			setFriendRequest(response.data);
		}
	}

	async function getUsersBlocked() {
		const response = await BackApi.getBlockedListById(id);
		console.log('TEST', response.data);
		if (response.data !== listFriendRequest) {
			setListBlockUsers(response.data);
		}
	}

	function receivedRequest(e: any) {
		setFriendRequest(prevList => [...prevList, e]);
	}

	useEffect(() => {
		setSocket(getSocket());
		getFriendRequest();
		getUsersBlocked();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (socket) {
			socket.on('receivedRequest', receivedRequest);
		}
	}, [socket])

	return (
		<div>
			<div>
				{listFriendRequest.length === 0 && "Pas de demande d'ami"}
				{listFriendRequest.map((request: any) => {
					return (
						<span key={request.id}>
							<FriendRequestList
								friendId={request.sendBy}
								requestId={request.id}
								listFriendRequest={listFriendRequest}
								setFriendRequest={setFriendRequest}
								/>
						</span>
					);
				})}
			</div>
			<div>
				{listBlockUsers.length === 0 && "Pas d'utilisateurs bannis"}
				{listBlockUsers.map((user: any) => {
					return (
						<span key={user.blockedId}>
							<BlockedUsersList
								idUserBlocked={user.blockedId}
								listBlockUsers={listBlockUsers}
								setListBlockUsers={setListBlockUsers}
								/>
						</span>
					);
				})}
			</div>

		</div>
	);
}