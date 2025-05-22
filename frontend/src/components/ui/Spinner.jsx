import React from 'react';

const Spinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  // Mapear tamaños a clases
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Mapear colores a clases
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-500',
    white: 'text-white'
  };

  // Clases del spinner
  const spinnerClasses = `
    inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent
    ${sizeClasses[size] || sizeClasses.md}
    ${colorClasses[color] || colorClasses.primary}
  `;

  // Si es pantalla completa, centrar en la pantalla
  if (fullScreen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-dark-800/50 flex flex-col items-center justify-center">
        <div className={spinnerClasses} role="status">
          <span className="sr-only">Cargando...</span>
        </div>
        <p className="mt-4 text-center text-white font-semibold">Cargando...</p>
      </div>
    );
  }

  // Versión normal
  return (
    <div className="flex justify-center items-center">
      <div className={spinnerClasses} role="status">
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default Spinner; 