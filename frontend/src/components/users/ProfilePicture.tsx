
import React from "react"

import './ProfilePicture.css'

type TProfilePicture = {
    image: string
    boxShadow?: boolean
}

export default function ProfilePicture({image, boxShadow} : TProfilePicture) {
    return (
        <div className={boxShadow ? 'pp-round flex-center shadow': 'pp-round flex-center'}>
            <img
                className='pp'
                src={image}
            />
        </div>
    )
}
