import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import { FriendRequestList } from "../FriendRequestList/FriendRequestList";

export function FriendRequest({ listFriendRequest }) {

	console.log('Component FriendRequest len', listFriendRequest.length);

	return (
		<div>
			{listFriendRequest.map((request) => {
				return (
					<span key={request.id}>
						<FriendRequestList friendId={request.sendBy} requestId={request.id} />
					</span>
				);
			})}
		</div>
	);
}