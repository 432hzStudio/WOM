import axios from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para incluir el token en las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores en las respuestas
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // Si hay un error de autenticación y no estamos en una página de login/registro,
      // podríamos redirigir a login (aunque esto normalmente se maneja en el componente)
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        // No redirigimos directamente aquí para evitar problemas con componentes
        // que no tienen acceso a history (se maneja en el componente)
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 