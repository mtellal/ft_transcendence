// import React from "react";

import { redirect } from "react-router-dom";

export async function loginRequest(username, password)
{
    return (fetch(`${process.env.REACT_APP_BACK}/auth/signin`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
            })
        })
        .then(res => res)
    )
}


export async function getUser(id) {
    fetch(`${process.env.REACT_APP_BACK}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${document.cookie.split("=")[1]}`
        }
    })
        .then(res => {
            if (!res.ok)
                return (redirect("/signin"));
            console.log(res);
            return res.json();
        })
        .then(data => data)
        .catch(err => console.log(err))
}