import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

const PrivateRoute = ({ children, requiredRoles }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return <Spinner />;
  }

  // Redirigir a login si no hay usuario autenticado
  if (!currentUser) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles requeridos si se especifican
  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si está autenticado y tiene el rol adecuado, renderizar el componente hijo
  return children;
};

export default PrivateRoute; 