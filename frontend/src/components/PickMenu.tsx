import React, { useState } from "react";

import './PickMenu.css'

type TPickMenu = {
    title: string,
    selected: boolean | string, 
    collection: any[],
    setSelected: (option?: any) => {} | any,
}

export default function PickMenu(props: TPickMenu) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <h2>{props.title}</h2>
            <div className="flex-column" onClick={() => setShow(p => !p)}>
                {
                    <div className="pickmenu-option">
                        <p>{props.selected || "Visibilty ..."}</p>
                    </div>
                }
                {
                    show && props.collection && props.collection.length &&
                    props.collection.map((option: any) =>
                        <div
                            key={option}
                            className="pickmenu-option hover-gray"
                            style={{ borderTop: '0' }}
                            onClick={() => props.setSelected(option)}
                        >
                            <p>
                                {option}
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}