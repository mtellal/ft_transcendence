
import React from "react"

import './ProfilePicture.css'

type TProfilePicture = {
    image: string
}

export default function ProfilePicture({image} : TProfilePicture) {
    return (
        <div className='pp-round flex-center'>
            <img
                className='pp'
                src={image}
            />
        </div>
    )
}
