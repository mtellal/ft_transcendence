import React, { useEffect } from 'react'

import './App.css';
import Footer from './components/Footer';
import Game from './components/Game';

import Header from './components/Header'
import Sidebar from './components/SideBar';
import Login from './components/Login';

function App() {

  return (
    <div className="App" >
      <Login />
      <Header />
      <Sidebar />
      <Game launch={false} />
      <Footer />
    </div>
  );
}

export default App;
