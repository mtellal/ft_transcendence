import React from "react";

import { Link } from "react-router-dom";
import Icon from "../Icon";

import './Collection.css'
import { Channel, User } from "../../types";
import { ChannelUserLabel } from "../../routes/Chat/components/ChannelProfile/ChannelUserLabel";

type TCollectionElement = {
    title: string, 
    add?: any, 
    removeNotif?: any,
    collection: any[]
}

export function CollectionElement(props: TCollectionElement) {

    return (
        <div className="collection-element">
            <div className="collection-element-label" >
                <h2 className="collection-element-title">{props.title}</h2>
                {
                    props.add ?
                        <Link
                            to="/chat/channel/create"
                            onClick={props.removeNotif}
                            style={{ textDecoration: 'none', color: 'black', justifySelf: 'flex-end' }}
                        >
                            <Icon icon="add" description="add" />
                        </Link>
                        : null
                }
            </div>
            <div className="flex-column">
                {props.collection}
            </div>
        </div>
    )
}


type TCollectionUsers = {
    title: string,
    users: User[],
    isAdmin?: boolean,
    currentUser?: User,
    channel: Channel,
    showChannelStatus: boolean
}

export function CollectionChannelUsers(props: TCollectionUsers) {

    return (
        <CollectionElement
            title={props.title}
            collection={
                props.users.map((user: any) =>
                    <ChannelUserLabel
                        key={`${props.title}-${user.id}`}
                        user={user}
                        channel={props.channel}
                        showChannelStatus={props.showChannelStatus}
                        isAddable={false}
                    />
                )
            }
        />
    )
}

