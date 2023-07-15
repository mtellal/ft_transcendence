import React, { createContext, useState } from "react";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import { getChannelByName } from "../../../../requests/chat";
import {  useCurrentUser } from "../../../../hooks/Hooks";

import { SearchInput } from "./SearchInput";

import { SearchedUser } from "./SearchedUser";
import { SearchedChannel } from "./SearchedChannel";

import './SearchElement.css'

export const SearchedChannelLabelContext: React.Context<any> = createContext(null);

export default function SearchElement() {
    const { token } = useCurrentUser();
    const [value, setValue]: any = useState("");
    const [error, setError] = useState("");
    const [searchedUser, setSearchedUser] = useState();
    const [channelList, setChannelList] = useState([]);

    const [inputRef, setInputRef]: any = useState();

    const { fetchUserByUsername } = useFetchUsers();

    async function searchUser() {
        if (!value || !value.trim())
            return;
        let user;
        let channelArray;
        setError("");
        setSearchedUser(null);
        setChannelList([]);
        user = await fetchUserByUsername(value.trim());
        if (user) {
            setSearchedUser(user);
        }
        await getChannelByName(value.trim(), token)
            .then(res => {
                if (res.data) {
                    channelArray = res.data;
                }
            })
        if (channelArray) {
            setChannelList(channelArray);
        }
        if (!user && !channelArray)
            setError("User/Channel not found");
    }

    function reset() {
        setChannelList(null);
        setSearchedUser(null);
        setValue("")
    }


    return (
        <div className="searchelement relative" >
            <SearchInput
                value={value}
                setValue={setValue}
                submit={() => searchUser()}
                onChange={() => { setSearchedUser(null); setChannelList([]); setError("") }}
                setInputRef={setInputRef}
            />
            {error && <p className="reset red-c absolute white" style={{ bottom: '-2px', fontSize: '12px' }}>{error}</p>}

            {
                (searchedUser || (channelList && channelList.length)) ?
                    <div className="absolute scroll label white"
                        style={{
                            zIndex: '3', height: '250px', width: '90%',
                            bottom: `-${inputRef && (inputRef.current.offsetHeight + 250)}px`, alignItems: 'center'
                        }}>

                        {
                            searchedUser && 
                            <SearchedUser resetInput={() => reset()} user={searchedUser} />
                        }
                        {
                            channelList && channelList.length ?
                                <SearchedChannel
                                    channels={channelList}
                                    reset={reset}
                                    inputRef={inputRef}
                                />
                                : null
                        }
                    </div>
                    : null
            }
        </div>
    )
}