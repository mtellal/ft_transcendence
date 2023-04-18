import React from 'react';

import '../styles/Footer.css'

export default function Footer()
{
    return (
        <div className='footer'>
            <p className='footer--authors'>Project realised by 
                <a className='author--link' href='https://profile.intra.42.fr/users/jdubilla' target="_blank" > jdubilla</a>,
                <a className='author--link' href='https://profile.intra.42.fr/users/mtellal' target="_blank" > mtellal</a>,
                <a className='author--link' href='https://profile.intra.42.fr/users/antbarbi' target="_blank" > antbarbi</a>,
                <a className='author--link' href='https://profile.intra.42.fr/users/aessakhi' target="_blank" > aessakhi</a>
            </p>
            <p className='footer--copyright'>© All rights reserved</p>
        </div>
    )
}