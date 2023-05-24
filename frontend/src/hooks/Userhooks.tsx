import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useUser()
{
    return (useContext(UserContext));
}