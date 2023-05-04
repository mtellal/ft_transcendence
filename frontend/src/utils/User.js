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



