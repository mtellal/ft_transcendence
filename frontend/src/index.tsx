import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/index';
import { App } from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './routes/Signup/Signup';
import { Signin } from './routes/Signin/Signin';
import { Profile } from './routes/Profile/Profile';
import { Provider } from 'react-redux';
import { Chat } from './routes/Chat/Chat';
import './global.css'
import { Login } from './routes/Login/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<App />} >
					<Route path='/profile' element={<Profile />} />
					<Route path='/chat' element={<Chat />} />
				</Route>
				<Route path='/signup' element={<Signup />} />
				<Route path='/signin' element={<Signin />} />
				<Route path='/login' element={<Login />} />
			</Routes>
		</BrowserRouter>
	</Provider>
);

/*
	Auth42
	2FA
	status des joueurs (en ligne, en jeu, deconnecte)
*/