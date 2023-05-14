import React from 'react'
import jwtDecode from 'jwt-decode';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';

import Header from '../App/Header';
import Footer from '../App/Footer';
import Sidebar from '../App/SideBar';
import { extractCookie } from '../utils/Cookie';
import { getUser, getUserProfilePictrue, updateUser } from '../utils/User';
import './App.css';


export async function loader() {
  const token = extractCookie("access_token");
  if (token) {
    let id = jwtDecode(token).sub;

    const user = await getUser(id);
    if (user === 200 && user.statusText === "OK")
      return (console.log("Error: app loader => ", user))

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

  const { user, token, image } = useLoaderData();
  const [profilePicture, setProfilePicture] = React.useState(image);
  const [username, setUsername] = React.useState(user && user.username);


  function updateHeader(obj)
  {
    setProfilePicture(obj.profilePicture);
    setUsername(obj.username);
    user.username = obj.username
  }

  function updateHeaderProfilePicture(url) {
    setProfilePicture(url);
  }

  function updateHeaderUsername(username) {
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

  React.useEffect(() => {
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
            user,
            token,
            image,
            updateHeader,
            updateHeaderProfilePicture,
            updateHeaderUsername,
            setUsername,
          }
        }
      />
    </div>
  );
}

export default App;
