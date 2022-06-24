import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense } from 'react';
import PrivateRoute from './components/auth/privateroute';
import SignUp from './components/auth/signup';
import PublicRoute from './components/auth/publicroute';
import { CreateAdmin } from './components/admin/createAdmin';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublicRoute />} />
          <Route path='/app/*' element={<PrivateRoute path='app' />} />
          <Route path="/signin" element={<PrivateRoute path='signin' />} />
          <Route path="/signup" element={<SignUp from='user' />} />
          <Route path='/create-admin' element={<CreateAdmin />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
