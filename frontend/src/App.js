import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';

import './App.css';

import Footer from './components/Footer';
import Header from './components/Header'
import Sidebar from './components/SideBar';
import LaunchGame from './components/Game';

function App() {

  const location = useLocation();

  return (
    <div className="App" >
      <Header />
      <Sidebar />
      {(location.pathname === "/game" || location.pathname === "/" )&& <LaunchGame />}
      <Footer />
      <Outlet />
    </div>
  );
}

export default App;
