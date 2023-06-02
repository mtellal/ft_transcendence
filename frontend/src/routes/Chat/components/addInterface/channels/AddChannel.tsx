import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import './AddChannel.css'


export default function AddChannel() {

    return (
        <div className="flex-center add-channel">
            <div className="flex-column-center addchannel-button-container">
                <Link to={"join"} className="button flex-center add-channel-button">
                    Join a Channel
                </Link>
                <Link to={"create"} className="button flex-center add-channel-button">
                    Create a Channel
                </Link>
            </div>
        </div>
    )
}
