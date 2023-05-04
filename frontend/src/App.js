import React from 'react'
import { Outlet, redirect } from 'react-router-dom';

import Footer from './App/Footer';
import Header from './App/Header'
import Sidebar from './App/SideBar';
import { extractCookie } from './utils/Cookie';

import './App.css';

export async function loader() {

  if (extractCookie("access_token")) {
    return (null)
  }
  return redirect("/signin");

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
