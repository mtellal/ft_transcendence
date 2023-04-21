import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';

import './App.css';

import Footer from './components/Footer';
import Game from './components/Game';
import Header from './components/Header'
import Sidebar from './components/SideBar';

function App() {

  const location = useLocation();

  return (
    <div className="App" >
      <Header />
      <Sidebar />
      {location.pathname !== "/profile" && <Game launch={false} />}
      <Footer />
      <Outlet />
    </div>
  );
}

export default App;
