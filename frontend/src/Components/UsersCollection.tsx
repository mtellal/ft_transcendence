import React, { useState } from "react";
import { useUser } from "../Hooks";
import { getUserByUsername } from "../utils/User";
import InfoInput from "./InfoInput";
import { FriendSearch } from "./FriendElement";
import { CollectionElement } from "../Chat/MenuElement";

export default function UsersCollection(props: any) {
    const [searchUserValue, setSearchUserValue] = useState("");
    const [searchUser, setSearchUser]: any = useState();
    const { user } = useUser();

    function alreadyInCollection(u: any) {
        return (props.users.find((p: any) => p.id === u.id) || user.id === u.id)
    }

    function reset() {
        setSearchUser(null)
        setSearchUserValue("")
    }

    async function search() {
        await getUserByUsername(searchUserValue)
            .then(res => setSearchUser(res.data))
    }

    function addUser(user: any) {
        if (!alreadyInCollection(user)) {
            props.setUsers((p: any) => [...p, user])
            reset();
        }
    }

    function removeUser(user: any) {
        props.setUsers((p: any) => p.filter((u: any) => u.id !== user.id))
    }

    return (
        <div style={{paddingBottom: '5px'}}>
            <hr/>
            <h2>{props.title}</h2>
            <InfoInput
                id={props.title}
                label={props.title}
                value={searchUserValue}
                setValue={setSearchUserValue}
                submit={() => search()}
            />
            {
                searchUser &&
                <FriendSearch
                    key={searchUser.id}
                    id={searchUser.id}
                    username={searchUser.username}
                    avatar={searchUser.avatar}
                    userStatus={searchUser.userStatus}
                    invitation={!alreadyInCollection(searchUser)}
                    accept={() => addUser(searchUser)}
                    refuse={() => reset()}
                />
            }
            {
                props.users.length ?
                    <CollectionElement
                        title=""
                        collection={
                            props.users.map((user: any) =>
                                <FriendSearch
                                    key={user.id}
                                    id={user.id}
                                    username={user.username}
                                    avatar={user.avatar}
                                    userStatus={user.userStatus}
                                    delete={() => removeUser(user)}
                                />
                            )
                        }
                    />
                    : null
            }
        </div>
    )
}