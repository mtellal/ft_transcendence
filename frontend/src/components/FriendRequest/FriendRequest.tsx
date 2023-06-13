import React, { useEffect, useState } from "react";
import { FriendRequestList } from "../FriendRequestList/FriendRequestList";
import { getSocket } from "../../utils/socket";
import { BackApi } from "../../api/back";

interface FriendRequestProps {
	id: number;
}

export function FriendRequest({ id }: FriendRequestProps) {

	const [socket, setSocket] = useState(null);
	const [listFriendRequest, setFriendRequest] = useState([]);

	async function getFriendRequest() {
		const response = await BackApi.getFriendRequest(id);
		if (response.data !== listFriendRequest) {
			setFriendRequest(response.data);
		}
	}

    function receivedRequest(e: any) {
		setFriendRequest(prevList => [...prevList, e]);
    }

	useEffect(() => {
		setSocket(getSocket());
		getFriendRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    useEffect(() => {
        if (socket) {
			socket.on('receivedRequest', receivedRequest);
        }
    }, [socket])

	if (listFriendRequest.length === 0) {
		return (
			<div>Pas de demande d'ami</div>
		);
	}

	return (
		<div>
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
	);
}