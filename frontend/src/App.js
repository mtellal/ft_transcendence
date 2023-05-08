import React from 'react'
import { Outlet, redirect, useLoaderData } from 'react-router-dom';

import Footer from './App/Footer';
import Header from './App/Header'
import Sidebar from './App/SideBar';
import { extractCookie } from './utils/Cookie';
import jwtDecode from 'jwt-decode';
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

    let image = await getUserProfilePictrue(id);
    if (image.status === 200 && image.statusText === "OK")
        image =  window.URL.createObjectURL(new Blob([image.data]))
    else
        image = null;
    return ([user.data, token, image]);
  }
  return redirect("/signin");
}

export const UserContext = React.createContext();

function App() {

  const [user, token, image] = useLoaderData();


  return (
    <UserContext.Provider value={[user, token, image]} >
      <div className="App" >
        <Header/>
        <Sidebar />
        <Footer />
        <Outlet />
      </div>
    </UserContext.Provider>
  );
}

export default App;
