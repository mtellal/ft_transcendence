import React from 'react'
import { Outlet, redirect } from 'react-router-dom';
import './App.css';

import Footer from './components/Footer';
import Header from './components/Header'
import Sidebar from './components/SideBar';
import { BackendAPI } from './api/api-backend';


export async function loader()
{
  console.log("load app")
  /*
    redirect to /login when user not logged or when cookies (auth) expired
  */
  //return redirect("/signin");
  return null;
}


BackendAPI.getUser(2);
// BackendAPI.getUserById(2);


function App() {

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
