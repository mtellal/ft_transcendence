import axios from "axios";
import React from "react";
import jwtDecode from "jwt-decode";
import {extractCookie} from './Cookie'
import { redirect } from "react-router-dom";

/*
    ask to login a user and 
    return a http response 
*/

export async function signinRequest(username, password)
{
    return (axios.post(`${process.env.REACT_APP_BACK}/auth/signin`, {
            username, 
            password
        })
        .then(res => res)
        .catch(err => err)
    )
}

/*
    ask to create a user and 
    return a http response 
*/

export async function signupRequest(username, password)
{
    return (axios.post(`${process.env.REACT_APP_BACK}/auth/signup`, {
            username, 
            password
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUser(id)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function getUserByUsername(username)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users?username=${username}`)
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateUser(user, id)
{
    return (
        axios.patch(`${process.env.REACT_APP_BACK}/users/${id}`, {
            ...user
        })
        .then(res => res)
        .catch(err => err)
    )
}

export async function updateProfilePicture(image, token)
{
    const formData = new FormData();
    formData.append('file', image);
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res)
        .catch(err => err)
    )
}


export async function getUserProfilePictrue(id)
{
    return (
        axios.get(`${process.env.REACT_APP_BACK}/users/${id}/profileImage`, {
            responseType:'arraybuffer'
        })
        .then(res => res)
        .catch(err => err)
    )
}


/*
    friendIDs a array of ids of users 
*/

export async function getUserFriends(friendIDs)
{
    return (await Promise.all(friendIDs.map(async (id) => await getUser(id))))
}

export async function addUserFriend(id1, id2)
{
    let params = new URLSearchParams("");
    params.append("id", id1);
    params.append("id of friend", id2);
    /* return (
        axios.post(`${process.env.REACT_APP_BACK}/users/addFriend`, params, {
            headers: {
                "Content-Type":'application/x-www-form-urlencoded'
            }
        })
        .then(res => res)
        .catch(err => err)
    ) */
    return (
        axios.post(`${process.env.REACT_APP_BACK}/users/addFriend?id=${id1}&id%20of%20friend=${id2}`)
        .then(res => res)
        .catch(err => err)
    )
}