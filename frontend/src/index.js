import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './routes/Signup/Signup.jsx';
import { Signin } from './routes/Signin/Signin.jsx';
import { Profile } from './routes/Profile/Profile.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<Routes>
			<Route path='/signup' element={<Signup />} />
			<Route path='/signin' element={<Signin />} />
			<Route path='/profile' element={<Profile />} />
		</Routes>
	</BrowserRouter>
);