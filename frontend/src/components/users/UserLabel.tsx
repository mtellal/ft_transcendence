
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom'

import Icon from '../Icon';
import { getUserProfilePictrue } from '../../requests/user'
import { TUserInfos, UserInfos } from './UserInfos';

import './UserLabel.css'

import check from '../../assets/Check.svg'
import cross from '../../assets/Cross.svg'
import { User } from '../../types';


type TUserLabelFriendRequest = TUserInfos & {
    user: User,
    accept: () => {} | any,
    refuse: () => {} | any,
}

export function UserLabelFriendRequest(props: TUserLabelFriendRequest) {
    return (
        <div className='user-label' 
            style={{background: 'white'}}
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
        >
            <UserInfos {...props} />
        </NavLink>
    )
}