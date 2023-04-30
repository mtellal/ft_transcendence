import React from 'react'
import { Outlet, redirect } from 'react-router-dom';

import './App.css';

import Footer from './components/Footer';
import Header from './components/Header'
import Sidebar from './components/SideBar';


export async function loader()
{
  console.log("load app")
  /*
    redirect to /login when user not logged or when cookies (auth) expired
  */
  //return redirect("/signin");
  return null;
}

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
