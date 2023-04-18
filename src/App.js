import './App.css';
import Footer from './components/Footer';
import Game from './components/Game';

import Header from './components/Header'
import Sidebar from './components/SideBar';

function App() {
  return (
    <div className="App">
      <Header />
      <Sidebar />
      <Game />
      <Footer />
    </div>
  );
}

export default App;
