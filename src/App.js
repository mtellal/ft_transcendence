import './App.css';
import Game from './components/Game';

import Header from './components/Header'
import Sidebar from './components/SideBar';

function App() {
  return (
    <div className="App">
      <Header />
      <Sidebar />
      <Game />
      <p>Footer</p>
    </div>
  );
}

export default App;
