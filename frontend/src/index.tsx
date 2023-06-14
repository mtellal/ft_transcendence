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
import { Login } from './routes/Login/Login';
import './global.css'

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
	2FA (qrcode).
	status des joueurs (en ligne, en jeu, deconnecte).
	Mettre un mdp sur les channels (meme si il n'est pas protected).
	Bloquer un user.
	Si le owner du chan le quitte, transferer statut owner a un autre user,
	si il est le dernier user, supprimer le chan.
	Affichage (CSS) des chans a join (reste que les protected je crois).
	Debloquer les gens d'un chan
	Debloquer des gens
	Ne plus voir les messages des users bannis
*/