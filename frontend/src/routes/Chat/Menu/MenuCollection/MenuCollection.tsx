import React, { useCallback, useEffect, useState } from "react";

import arrowTop from '../../../../assets/arrowTop.svg'
import arrowBot from '../../../../assets/arrowBot.svg'

import plusIcon from '../../../../assets/Plus.svg'
import joinIcon from '../../../../assets/Login.svg'

import { useNavigate } from "react-router-dom";
import Icon from "../../../../components/Icon";

import './MenuCollection.css';

type TCollectionElement = {
    title: string,
    collection: any[],
    borderTop?: boolean,
    icon?: any
}

export function MenuCollectionElement(props: TCollectionElement) {
    const [show, setShow] = useState(props.title === "Messages");
    return (
        <div className="menu-collection">
            <div className="menu-collection-label pointer"
                onClick={() => setShow((p: boolean) => !p)}
            >
                <h2 className="reset menu-collection-title">{props.title}</h2>
                <p className="menu-collection-length"
                    style={{}}
                >{props.collection && props.collection.length}</p>
                <div className="flex" style={{ marginLeft: 'auto' }}>
                    <img src={show ? arrowBot : arrowTop} style={{ marginLeft: '10px' }} />
                </div>
            </div>
            {
                show &&
                <div className="flex-column">
                    {props.collection}
                </div>
            }
        </div>
    )
}

type TCollectionChannel = {
    title: string,
    collection: any[],
    borderTop?: boolean,
    icon?: any
}

export function MenuCollectionChannel(props: TCollectionChannel) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    return (
        <div className="menu-collection">
            <div className="menu-collection-label pointer"
                onClick={() => setShow((p: boolean) => !p)}
            >
                <h2 className="reset menu-collection-title">{props.title}</h2>
                <p className="menu-collection-length"
                    style={{}}
                >{props.collection && props.collection.length}</p>
                <div className="flex" style={{ marginLeft: 'auto' }}>
                    <div className="flex " style={{ height: '30px', gap: '5px' }}>
                        <Icon
                            icon={plusIcon}
                            onClick={() => {
                                setShow((p: boolean) => !p);
                                navigate("/chat/channel/create")
                            }}
                        />
                        <Icon
                            icon={joinIcon}
                            onClick={() => {
                                setShow((p: boolean) => !p);
                                navigate("/chat/channel/join")
                            }}
                        />
                    </div>
                    <img src={show ? arrowBot : arrowTop} style={{ marginLeft: '10px' }} />
                </div>
            </div>
            {
                show &&
                <div className="flex-column">
                    {props.collection}
                </div>
            }
        </div>
    )
}
