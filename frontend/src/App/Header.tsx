import React, { useContext } from 'react';

import './Header.css'

import { Link } from 'react-router-dom';

export default function Header({profilePicture, username, ...props} : any)
{
    return (
        <header className='header'>
            <p className='header-pong'>Pong</p>
            <div className='pp-container'>
                <Link 
                    className='pp-link'
                    to={"/profile"}
                >
                    <div className='pp-round'>
                        <img 
                            className='pp'
                            src={profilePicture || "./assets/user.png"}
                        />
                    </div>
                <p className='pp-username'>{username}</p>
                </Link>
            </div>
        </header>
    )
}