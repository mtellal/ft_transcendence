import React, { useState } from "react";

import './PickMenu.css'

type TPickMenu = {
    title?: string,
    selected: boolean | string, 
    collection: any[],
    setSelected: (option?: any) => {} | any,
    picking?: () => {} | any
}

export default function PickMenu(props: TPickMenu) {
    const [show, setShow] = useState(false);

    return (
            <div className="flex-column" onClick={() => {setShow(p => !p); props.picking && props.picking()}}>
                {
                    <div className="pickmenu-option-selected">
                        <p>{props.selected || "Visibilty ..."}</p>
                    </div>
                }
                {
                    show && props.collection && props.collection.length &&
                    props.collection.map((option: any) =>
                        <div
                            key={option}
                            className="pickmenu-options hover-gray"
                            onClick={() => props.setSelected(option)}
                        >
                            <p>
                                {option}
                            </p>
                        </div>
                    )
                }
            </div>
    )
}