import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-display text-primary-600 font-bold text-xl">
                WOM Argentina
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `border-transparent text-dark-500 hover:border-dark-300 hover:text-dark-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? 'border-primary-500 text-dark-900' : ''}`
                }
              >
                Inicio
              </NavLink>
              <NavLink 
                to="/como-funciona" 
                className={({ isActive }) => 
                  `border-transparent text-dark-500 hover:border-dark-300 hover:text-dark-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? 'border-primary-500 text-dark-900' : ''}`
                }
              >
                Cómo funciona
              </NavLink>
              <NavLink 
                to="/precios" 
                className={({ isActive }) => 
                  `border-transparent text-dark-500 hover:border-dark-300 hover:text-dark-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? 'border-primary-500 text-dark-900' : ''}`
                }
              >
                Precios
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="ml-3 relative flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="btn-outline text-sm"
                >
                  Panel de Control
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-dark-500 hover:text-dark-700 text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-dark-500 hover:text-dark-700 text-sm font-medium">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Regístrate
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-400 hover:text-dark-500 hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu móvil */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 
                'bg-primary-50 border-primary-500 text-primary-700' : 
                'border-transparent text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700'}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/como-funciona"
            className={({ isActive }) => 
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 
                'bg-primary-50 border-primary-500 text-primary-700' : 
                'border-transparent text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700'}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Cómo funciona
          </NavLink>
          <NavLink
            to="/precios"
            className={({ isActive }) => 
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 
                'bg-primary-50 border-primary-500 text-primary-700' : 
                'border-transparent text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700'}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Precios
          </NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-dark-200">
          {currentUser ? (
            <div className="space-y-1">
              <Link 
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel de Control
              </Link>
              <button
                onClick={(e) => {
                  handleLogout(e);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link 
                to="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 hover:bg-dark-50 hover:border-dark-300 hover:text-dark-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 