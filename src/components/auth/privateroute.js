import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '../layout/layout';
import SignIn from './signin';

const PrivateRoute = ({ path }) => {
  const isSignedIn = localStorage.getItem('session-token');
  return isSignedIn && path === 'app' ? <Layout /> 
  : isSignedIn && path === 'signin' ? <Navigate to='/app' />
  : !isSignedIn && path === 'app' ? <Navigate to='/signin' />
  : <SignIn />;
}

export default PrivateRoute;