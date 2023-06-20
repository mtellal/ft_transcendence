import React from "react";

import './RemoveElement.css'

type TRemoveFriend = {
    user: any, 
    remove: () => {} | any, 
    cancel: () => {} | any
}

export function RemoveElement(props: TRemoveFriend) {
    return (
        <div className="absolute flex-column-center remove-friend">
            <div className="flex-column-center remove-friend-div">
                <p>Are you sure to remove <span className="remove-friend-username">{props.user}</span> ?</p>
                <div className="remove-friend-buttons">
                    <button
                        className="button red white-color remove-friend-button"
                        onClick={props.remove}
                    >
                        Remove
                    </button>
                    <button
                        className="button white remove-friend-button"
                        onClick={props.cancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

type TRemoveView = {
    currentChannel: any, 
    currentFriend: any, 
    cancel: () => {} | any, 
    leaveChannel: () => {} | any, 
    removeFriend: () => {} | any, 
}

export default function RemoveView(props: TRemoveView) {
    return (
        <>
            {
                props.currentChannel && props.currentChannel.type !== "WHISPER" &&
                <RemoveElement
                    user={props.currentChannel && props.currentChannel.name}
                    cancel={props.cancel}
                    remove={props.leaveChannel}
                />
            }
            {
                props.currentFriend &&  props.currentChannel && props.currentChannel.type === "WHISPER" && 
                <RemoveElement
                    user={props.currentFriend && props.currentFriend.username}
                    cancel={props.cancel}
                    remove={props.removeFriend}
                />
            }
        </>
    )
}
