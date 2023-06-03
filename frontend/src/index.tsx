import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './routes/Signup/Signup';
import { Signin } from './routes/Signin/Signin';
import { Profile } from './routes/Profile/Profile';
import { Provider } from 'react-redux';
import store from './store/index';
import { Chat } from './routes/Chat/Chat';
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
			</Routes>
		</BrowserRouter>
	</Provider>
);