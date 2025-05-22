import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario autenticado cuando se carga la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Obtener token JWT
          const token = await firebaseUser.getIdToken();
          
          // Guardar token en localStorage
          localStorage.setItem('authToken', token);
          
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener datos del usuario desde nuestro backend
          const response = await api.get('/api/auth/me');
          
          if (response.data.status === 'success') {
            setCurrentUser({
              ...response.data.data.user,
              firebaseUser
            });
            setUserProfile(response.data.data.profile);
          }
        } catch (err) {
          console.error('Error al cargar datos de usuario:', err);
          setError('Error al cargar datos de usuario');
          // Si hay error, limpiar autenticación
          await signOut(auth);
          localStorage.removeItem('authToken');
          setCurrentUser(null);
          setUserProfile(null);
        }
      } else {
        // No hay usuario autenticado
        localStorage.removeItem('authToken');
        api.defaults.headers.common['Authorization'] = null;
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  // Registro con email y contraseña
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Registrar en Firebase
      const firebaseUserCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // Obtener token
      const token = await firebaseUserCredential.user.getIdToken();
      
      // Registrar en nuestro backend
      const response = await api.post('/api/auth/register', {
        ...userData,
        firebaseUid: firebaseUserCredential.user.uid,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        localStorage.setItem('authToken', response.data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        
        setCurrentUser({
          ...response.data.data.user,
          firebaseUser: firebaseUserCredential.user
        });
      }
      
      return response.data;
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      let errorMessage = 'Error al registrar usuario';
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.code) {
        // Manejar errores de Firebase
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'El email ya está en uso';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El email no es válido';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Operación no permitida';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña es demasiado débil';
            break;
          default:
            errorMessage = err.message;
            break;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login con email y contraseña
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Autenticar en Firebase
      const firebaseUserCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtener token
      const token = await firebaseUserCredential.user.getIdToken();
      
      // Autenticar en nuestro backend
      const response = await api.post('/api/auth/login', {
        email,
        password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        localStorage.setItem('authToken', response.data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        
        setCurrentUser({
          ...response.data.data.user,
          firebaseUser: firebaseUserCredential.user
        });
        
        setUserProfile(response.data.data.profile);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      let errorMessage = 'Error al iniciar sesión';
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.code) {
        // Manejar errores de Firebase
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Email o contraseña incorrectos';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El email no es válido';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Este usuario ha sido desactivado';
            break;
          default:
            errorMessage = err.message;
            break;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login con Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Autenticar con Google en Firebase
      const firebaseUserCredential = await signInWithPopup(auth, googleProvider);
      
      // Obtener token
      const token = await firebaseUserCredential.user.getIdToken();
      
      // Autenticar en nuestro backend
      const response = await api.post('/api/auth/google', {
        googleToken: token
      });

      if (response.data.status === 'success') {
        localStorage.setItem('authToken', response.data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        
        // Obtener datos completos del usuario
        const userResponse = await api.get('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${response.data.data.token}`
          }
        });
        
        setCurrentUser({
          ...userResponse.data.data.user,
          firebaseUser: firebaseUserCredential.user
        });
        
        setUserProfile(userResponse.data.data.profile);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error al iniciar sesión con Google:', err);
      let errorMessage = 'Error al iniciar sesión con Google';
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.code) {
        // Errores de Firebase OAuth
        switch (err.code) {
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'Ya existe una cuenta con este email usando otro método de inicio de sesión';
            break;
          case 'auth/popup-blocked':
            errorMessage = 'El navegador ha bloqueado la ventana emergente';
            break;
          case 'auth/popup-closed-by-user':
            errorMessage = 'La ventana de inicio de sesión fue cerrada';
            break;
          default:
            errorMessage = err.message;
            break;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cerrar sesión
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      api.defaults.headers.common['Authorization'] = null;
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Error al cerrar sesión');
    }
  }, []);

  // Actualizar perfil de usuario
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Determinar qué endpoint usar según el rol
      const endpoint = currentUser.role === 'voicer' 
        ? '/api/users/voicer-profile'
        : '/api/users/brand-profile';
      
      // Actualizar en backend
      const response = await api.put(endpoint, profileData);

      if (response.data.status === 'success') {
        // Refrescar datos del perfil
        const userResponse = await api.get('/api/auth/me');
        setCurrentUser(prev => ({
          ...userResponse.data.data.user,
          firebaseUser: prev.firebaseUser
        }));
        setUserProfile(userResponse.data.data.profile);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 