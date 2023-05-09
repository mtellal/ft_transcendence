import React from 'react'
import jwtDecode from 'jwt-decode';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';

import Header from './App/Header';
import Footer from './App/Footer';
import Sidebar from './App/SideBar';
import { extractCookie } from './utils/Cookie';
import { getUser, getUserProfilePictrue } from './utils/User';
import './App.css';

export async function loader() {
  const token = extractCookie("access_token");
  if (token)
  {
    let id = jwtDecode(token).sub;

    const user = await getUser(id);
    if (user === 200 && user.statusText === "OK")
      return (console.log("Error: app loader => ", user))

    let imageURL = await getUserProfilePictrue(id);
    if (imageURL.status === 200 && imageURL.statusText === "OK")
      imageURL =  window.URL.createObjectURL(new Blob([imageURL.data]))
    else
      imageURL = null;

    return ({user: {...user.data}, token, imageURL})
  }
  return (redirect("/signin"));
}

export const UserContext = React.createContext();

function App() {
  
  const {user, token, imageURL} = useLoaderData();
  const [profilePicture, setProfilePicture] = React.useState(imageURL);
  const [username, setUsername] = React.useState(user && user.username);


  function updateHeaderProfilePicture(url)
  {
    setProfilePicture(url);
  }

  function updateHeaderUsername(username)
  {
    setUsername(username);
    user.username = username;
  }
  

  return (
    <UserContext.Provider value={[user, token, profilePicture]} >
      <div className="App" >
        <Header 
          profilePicture={profilePicture} 
          username={username}
        />
        <Sidebar />
        <Footer />
        <Outlet 
          context={{
            updateHeaderProfilePicture, 
            updateHeaderUsername
          }}
        />
      </div>
    </UserContext.Provider>
  );
}

export default App;
