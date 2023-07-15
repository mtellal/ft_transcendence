import React, { useEffect } from "react";

import search from '../../../../assets/search.svg'

import './SearchInput.css'


type TSearchInput = {
    blur?: boolean,
    value: string,
    setValue: (s: string) => {},
    submit?: () => {} | any,
    onChange?: any,
    setInputRef: (p: any) => void
}

export function SearchInput(props: TSearchInput) {
    const inputRef: any = React.useRef();

    useEffect(() => {
        if (props.setInputRef)
            props.setInputRef(inputRef);
    }, [props.setInputRef])

    function onChange(e: any) {
        if (e.target.value.length <= 20) {
            props.setValue(e.target.value);
            if (props.onChange)
                props.onChange(e)
        }
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter' && props.value) {
            props.submit()
            if (props.blur)
                inputRef.current.blur();
        }
    }

    return (
        <div className="menu-searchinput" >
            <div className="" style={{ marginRight: '5px' }}>
                <img src={search} alt="search" />
            </div>
            <input
                id="menu-searchinput-input"
                ref={inputRef}
                placeholder="Search"
                value={props.value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}