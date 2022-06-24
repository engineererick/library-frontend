import React from 'react';
import { Navigate } from 'react-router-dom';
import SignIn from './signin';

const PublicRoute = () => {
  const isSignedIn = localStorage.getItem('session-token');
  return isSignedIn ? <Navigate to='/app' /> : <SignIn />;
}

export default PublicRoute;