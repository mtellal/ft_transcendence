import React, { useState } from "react";



export default function PickMenu(props: any) {
    const [show, setShow] = useState(false);

    return (
        <div onClick={() => setShow(p => !p)}>
            <h2>{props.title}</h2>
            <div className="flex-column">
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