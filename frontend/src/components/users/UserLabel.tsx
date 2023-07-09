
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom'

import Icon from '../Icon';
import { getUserProfilePictrue } from '../../requests/user'
import { TUserInfos, UserInfos } from './UserInfos';

import './UserLabel.css'
import { getBlockList } from '../../requests/block';
import { useCurrentUser } from '../../hooks/Hooks';

import check from '../../assets/Check.svg'
import cross from '../../assets/Cross.svg'
import { User } from '../../types';


type TUserLabelSearch = TUserInfos & {
    id: number,
    add?: boolean,
    invitation?: boolean,
    accept?: () => {} | any,
    refuse?: () => {} | any,
    delete?: () => {} | any,
    onClick?: () => {} | any,
}

export function UserLabelSearch(props: TUserLabelSearch) {
    const [invitation, setInvitation]: [any, any] = React.useState(false);
    const { user, token } = useCurrentUser();

    const [url, setUrl]: any = useState();

    const [currentUserBlocked, setCurrentUserBlocked] = useState(false);

    async function loadBlockList() {
        const blockList = await getBlockList(props.id, token);
        if (blockList && blockList.length && blockList.find((o: any) => o.userId === user.id))
            setCurrentUserBlocked(true);
    }

    async function loadURL() {
        await getUserProfilePictrue(props.id, token)
            .then(res => {
                if (res.status == 200 && res.statusText == "OK")
                    setUrl(window.URL.createObjectURL(new Blob([res.data])))
            })
    }

    useEffect(() => {
        if (props.id) {
            loadURL();
            // loadBlockList();
        }
    }, [props.id])

    return (
        <div className='flex-ai UserLabelSearch-container'>
            <UserInfos {...props} />
            {
                currentUserBlocked && !props.delete && !props.invitation &&
                <p>Blocked</p>
            }
            {
                !currentUserBlocked && props.add && !invitation &&
                <Icon
                    icon="add"
                    onClick={() => { props.onClick(); setInvitation(true) }}
                />
            }
            {props.invitation &&
                <>
                    <Icon icon={check} onClick={props.accept} />
                    <Icon icon="close" onClick={props.refuse} />
                </>
            }
            {
                props.delete && <Icon icon="delete" onClick={props.delete} />
            }
        </div>
    )
}


type TUserLabelFriendRequest = TUserInfos & {
    user: User,
    accept: () => {} | any,
    refuse: () => {} | any,
}

export function UserLabelFriendRequest(props: TUserLabelFriendRequest) {
    return (
        <div className='flex-ai user-label'
            style={{backgroundColor: 'white'}}
        >
            <UserInfos user={props.user} />
            <div className='userlabel-friend-request'>
                <div>
                    <Icon icon={check} onClick={props.accept} />
                </div>
                <div>
                    <Icon icon={cross} onClick={props.refuse} />
                </div>
            </div>
        </div>
    )
}



type TUserLabel = TUserInfos & {
    id: number,
    notifs?: number,
    message?: string,
    onClick?: () => {} | any
    disable?: boolean
}

export default function UserLabel(props: TUserLabel) {

    const { userId } = useParams();

    return (
        <NavLink to={`/chat/user/${props.id}`}
            className="user-label"
            style={Number(userId) === props.id && !props.disable ? { backgroundColor: '#fff3e6' } : { }}
            onClick={() => props.onClick}
        >
            <UserInfos {...props} />
        </NavLink>
    )
}