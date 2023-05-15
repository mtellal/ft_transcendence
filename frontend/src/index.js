import React from 'react';
import ReactDOM from 'react-dom/client';
// import { App } from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './routes/Signup/Signup.jsx';
import { Signin } from './routes/Signin/Signin.jsx';
import { Profile } from './routes/Profile/Profile.jsx';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { Chat } from './routes/Chat/Chat.jsx';
import './global.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path='/signup' element={<Signup />} />
				<Route path='/signin' element={<Signin />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/chat' element={<Chat />} />
			</Routes>
		</BrowserRouter>
	</Provider>
);