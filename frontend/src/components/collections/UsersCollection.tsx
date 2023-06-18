import React, { useState } from "react";
import { useCurrentUser } from "../../hooks/Hooks";
import { getUserByUsername } from "../../requests/user";
import InfoInput from "../Input/InfoInput";
import { UserLabelSearch } from "../users/UserLabel";
import { CollectionElement } from "./CollectionElement";

type TUsersCollection = {
    title: string,
    users: any[],
    setUsers: (u : any) => {} | any,
    blackList?: any[]
}

export default function UsersCollection(props: TUsersCollection) {
    const [searchUserValue, setSearchUserValue]: [string, any] = useState("");
    const [searchUser, setSearchUser]: any = useState();
    const { user } = useCurrentUser();

    function alreadyInCollection(u: any) {
        return (props.users.find((p: any) => p.id === u.id) || user.id === u.id)
    }

    function reset() {
        setSearchUser(null)
        setSearchUserValue("")
    }

    async function search() {
        if (!searchUserValue && !searchUserValue.trim())
            return 
        await getUserByUsername(searchUserValue)
            .then(res => setSearchUser(res.data))
    }

    function addUser(user: any) {
        if (props.blackList && props.blackList.length && 
                props.blackList.find((u: any) => u.id === user.i))
        {
            return ;
        }
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
                <UserLabelSearch
                    key={searchUser.id}
                    id={searchUser.id}
                    user={searchUser}
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
                                <UserLabelSearch
                                    key={user.id}
                                    id={user.id}
                                    user={user}
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