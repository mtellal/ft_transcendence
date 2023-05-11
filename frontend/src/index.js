import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './components/Signup/Signup.jsx';
import { Signin } from './components/Signin/Signin.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<Routes>
			{/* <Route path='/' element={<App />}> */}
			{/* <Route path='/' element={<Signup />}> */}
			<Route path='/signup' element={<Signup />} />
			<Route path='/signin' element={<Signin />} />
			{/* </Route> */}
		</Routes>
	</BrowserRouter>
);