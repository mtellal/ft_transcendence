import React from 'react';

import './Header.css'
import { Link } from 'react-router-dom';

export default function Header(props)
{
    return (
        <header className='header'>
            <Link to={"/"} className='header--pong'>Pong</Link>
        </header>
    )
}