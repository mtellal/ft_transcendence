import React from 'react'
import jwtDecode from 'jwt-decode';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';

import Header from '../App/Header';
import Footer from '../App/Footer';
import Sidebar from '../App/SideBar';
import { extractCookie } from '../utils/Cookie';
import { getUser, getUserProfilePictrue, updateUser, blockUserRequest, unblockUserRequest } from '../utils/User';

import './App.css';


export async function loader() {
  const token = extractCookie("access_token");
  if (token) {
    let id = jwtDecode<any>(token).id;

    const user = await getUser(id);
    if (user.status !== 200 || user.statusText !== "OK")
      console.log("Error: app loader => ", user)

    let image = await getUserProfilePictrue(id);
    if (image.status === 200 && image.statusText === "OK")
      image = window.URL.createObjectURL(new Blob([image.data]))
    else
      image = null;

    return ({ user: { ...user.data }, token, image })
  }
  return (redirect("/login"));
}

function App() {

  const { user, token, image }: any = useLoaderData();
  const [profilePicture, setProfilePicture] = React.useState(image);
  const [username, setUsername] = React.useState(user && user.username);

  const [currentUser, setCurrentUser] : [any, any] = React.useState();

  React.useEffect(() => {
    if (user)
      setCurrentUser(user);
  }, [user])

  async function blockUser(id : number | string)
  {
    const blockRes = await blockUserRequest(id, token);
    if (blockRes.status === 201 && blockRes.statusText === "Created")
    {
      console.log(id, " user blocked");
    }
    else
      console.log("error in blockUser ", blockRes);
    setCurrentUser((u : any) => ({...u, blockedList: [...u.blockedList, id]}))
  }

  async function unblockUser(id : number | string)
  {
    const unblockRes = await unblockUserRequest(id, token);
    if (unblockRes.status === 200 && unblockRes.statusText === "OK")
    {
      console.log(id, " user blocked");
    }
    else
      console.log("error in blockUser ", unblockRes);
    setCurrentUser((u : any) => ({...u, blockedList: u.blockedList.filter((i : any) => i !== id)}))
  }


  function updateHeader(obj: any) {
    setProfilePicture(obj.profilePicture);
    setUsername(obj.username);
    user.username = obj.username
  }

  function updateHeaderProfilePicture(url: any) {
    setProfilePicture(url);
  }

  function updateHeaderUsername(username: any) {
    setUsername(username);
    user.username = username;
  }

  async function logout() {
    const res = await updateUser(
      {
        userStatus: "OFFLINE"
      }, user.id)
    if (res.status !== 200 && res.statusText !== "OK")
      console.log(res)
  }

  async function login() {
    const res = await updateUser(
      {
        userStatus: "ONLINE"
      }, user.id)
    if (res.status !== 200 && res.statusText !== "OK")
      console.log(res)
  }

  React.useEffect((): any => {
    login();
    return (() => logout())
  }, [])

  return (
    <div className="App" >
      <Header
        profilePicture={profilePicture}
        username={username}
      />
      <Sidebar />
      <Footer />
      <Outlet
        context={
          {
            currentUser,
            user,
            token,
            image,
            updateHeader,
            updateHeaderProfilePicture,
            updateHeaderUsername,
            setUsername,
            blockUser,
            unblockUser
          }
        }
      />
    </div>
  );
}

export default App;
