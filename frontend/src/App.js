import React from 'react'
import { Outlet, redirect } from 'react-router-dom';
import './App.css';

import Footer from './App/Footer';
import Header from './App/Header'
import Sidebar from './App/SideBar';
import { extractCookie } from './utils/Cookie';

export async function loader()
{
  console.log("loader app")
  /*
    redirect to /login when user not logged or when cookies (auth) expired
  */

  if (extractCookie("access_token"))
  {
    return (null)
  }

  console.log("redirect signin")
  return redirect("/signin");
}


// BackendAPI.getUser(2);
// BackendAPI.getUserById(2);


function App() {

  React.useEffect(() => {
    console.log("rendu") 
  })

  return (
    <div className="App" >
      <Header />
      <Sidebar />
      <Footer />
      <Outlet />
    </div>
  );
}

export default App;
