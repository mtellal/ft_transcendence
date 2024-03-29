import React from "react";

import {
    useCurrentUser
} from "../../../hooks/Hooks";
import ProfilePicture from "../../../components/users/ProfilePicture";
import useAdinistrators from "../../../hooks/Chat/useAdministrators";
import { useNavigate } from "react-router-dom";
import { Channel, User } from "../../../types";

import ownerIcon from '../../../assets/House.svg';
import adminIcon from '../../../assets/ShieldCheck.svg'


import './Message.css'

type TAuthorAccess = {
    author: User,
    channel: Channel,
    id: number,
    type: string,
}

function AuthorAccess(props: TAuthorAccess) {
    const navigate = useNavigate();
    const { isUserAdministrators } = useAdinistrators(props.channel);

    return (
        <div
            className="flex pointer"
            onClick={() => navigate(`/user/${props.author.id}`)}
            style={{ alignItems: 'flex-end' }}
        >
            <p className="message-author">{props.author.username}</p>
            <div className="flex" style={{ alignItems: 'flex-end' }}>
                {
                    props.channel.type !== "WHISPER" && props.author &&
                    props.channel.ownerId === props.author.id &&
                    <img src={ownerIcon} style={{ height: '20px' }} />
                }
                {
                    props.author &&
                    isUserAdministrators(props.author) &&
                    <img src={adminIcon} style={{ height: '20px' }} />
                }
            </div>
        </div>
    )
}


type TUserMessage = {
    lastMessage: boolean,
    author: User,
    id: number,
    content: string
    channel: Channel
}

function AuthorMessage(props: TUserMessage) {

    const navigate = useNavigate();

    let type = props.channel && props.channel.type;

    function style() {
        let style: any = { scrollMargin: '30px' };
        if (props.author && !props.lastMessage) {
            style = { ...style, marginBottom: '30px' }
        }
        return (style);
    }

    return (
        <div className="message-div" style={style()}>
            <div className="flex-column">
                <div className="flex" style={{ alignItems: 'flex-end' }}>
                    {
                        props.author &&
                        <div
                            className="relative pointer"
                            onClick={() => navigate(`/user/${props.author.id}`)}
                        >
                            <ProfilePicture
                                image={props.author.url}
                                boxShadow={true}
                                style={{ height: '30px', width: '30px' }}
                            />
                        </div>
                    }

                    <p className="message"
                        style={props.author ?
                            { marginLeft: '5px' } :
                            { marginLeft: '35px' }}
                    >
                        {props.content}
                    </p>
                </div>

                {
                    props.author && type !== "WHISPER" &&
                    <AuthorAccess
                        id={props.id}
                        author={props.author}
                        type={type}
                        channel={props.channel}
                    />
                }
            </div>
        </div>
    )

}


type TMessengerCurrentUserLabel = {
    author: User,
    content: string
    channel: Channel
}

function AuthorCurrentUserMessage(props: TMessengerCurrentUserLabel) {

    const { isUserAdministrators } = useAdinistrators(props.channel);

    return (
        <div style={{ padding: '0 2%' }}>
            <div className="flex-column">
                <div
                    className="flex"
                    style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                >
                    <p className="message"
                        style={props.author ?
                            { marginRight: '5px' } :
                            { marginRight: '35px' }}
                    >
                        {props.content}
                    </p>
                    {
                        props.author &&
                        <ProfilePicture
                            style={{ height: '30px', width: '30px' }}
                            image={props.author.url}
                        />
                    }
                </div>

                <div
                    className="flex"
                    style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: '2px' }}
                >
                    {
                        props.channel && props.channel.type !== "WHISPER" &&
                        <div>
                            {
                                props.channel.type !== "WHISPER" && props.author &&
                                props.channel.ownerId === props.author.id &&
                                <img src={ownerIcon} style={{ height: '20px' }} />
                            }
                            {
                                props.author &&
                                isUserAdministrators(props.author) &&
                                <img src={adminIcon} style={{ height: '20px' }} />
                            }
                        </div>
                    }
                    {
                        props.author &&
                        <p className="message-author">{props.author.username}</p>
                    }
                </div>

            </div>
        </div>
    )
}


type TMessage = {
    id: number,
    content: string,
    sendBy: number,
    lastMessage: boolean,
    displayUser: boolean,
    author: User,
    owner: boolean,
    channel: Channel
}


export default function Message(props: TMessage) {

    const { user } = useCurrentUser();

    return (
        <>
            {
                props.sendBy === user.id ?
                    <AuthorCurrentUserMessage
                        {...props}
                    /> :
                    <AuthorMessage
                        {...props}
                    />
            }
        </>
    )
}
