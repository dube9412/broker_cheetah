import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LenderProtectedRoutes = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isLender) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default LenderProtectedRoutes;
