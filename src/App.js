import React, { useEffect } from 'react'

import './App.css';
import Footer from './components/Footer';
import Game from './components/Game';

import Header from './components/Header'
import Sidebar from './components/SideBar';

function App() {

  return (
    <div className="App" >
      <Header />
      <Sidebar />
      <Game />
      <Footer />
      {/* <canvas ref={canvasRef}>

      </canvas>
      <button onClick={resetHandler}>reset</button> */}
    </div>
  );
}

export default App;
