import React from 'react'
import jwtDecode from 'jwt-decode';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';

import Header from '../App/Header';
import Footer from '../App/Footer';
import Sidebar from '../App/SideBar';
import { extractCookie } from '../utils/Cookie';
import {
  getUser,
  getUserProfilePictrue,
  updateUser,
  blockUserRequest,
  unblockUserRequest
} from '../utils/User';

import './App.css';
import { UserProvider } from '../contexts/UserContext';
import { useUser } from '../Hooks';


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

    return ({ user: { ...user.data}, token, image})
  }
  return (redirect("/login"));
}

function App() {

  const {user, token, image}: any = useLoaderData();
  console.log(user.image)

  const [currentUser, setCurrentUser]: [any, any] = React.useState();

  React.useEffect(() => {
    if (user)
      setCurrentUser(user);
  }, [user])

  async function blockUser(id: number | string) {
    const blockRes = await blockUserRequest(id, user.token);
    if (blockRes.status === 201 && blockRes.statusText === "Created") {
      console.log(id, " user blocked");
    }
    else
      console.log("error in blockUser ", blockRes);
    setCurrentUser((u: any) => ({ ...u, blockedList: [...u.blockedList, id] }))
  }

  async function unblockUser(id: number | string) {
    const unblockRes = await unblockUserRequest(id, user.token);
    if (unblockRes.status === 200 && unblockRes.statusText === "OK") {
      console.log(id, " user blocked");
    }
    else
      console.log("error in blockUser ", unblockRes);
    setCurrentUser((u: any) => ({ ...u, blockedList: u.blockedList.filter((i: any) => i !== id) }))
  }

  return (
    <div className="App" >
      <UserProvider 
        user={user} 
        token={token} 
        image={image}
      >
        <Header
          profilePicture={user.image}
        />
        <Sidebar />
        <Footer />
        <Outlet />
      </UserProvider>
    </div>
  );
}

export default App;
