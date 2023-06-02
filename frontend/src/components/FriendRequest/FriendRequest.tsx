import React from "react";
import { FriendRequestList } from "../FriendRequestList/FriendRequestList";

interface FriendRequestProps {
	listFriendRequest: any;
	setFriendRequest: any;
}

export function FriendRequest({ listFriendRequest, setFriendRequest }: FriendRequestProps) {

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