import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const DashboardPage = () => {
  const { currentUser, userProfile } = useContext(AuthContext);

  // Determinar qué bloques mostrar según el rol
  const isBrand = currentUser?.role === 'brand';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Panel de bienvenida */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-dark-100">
        <h2 className="text-xl font-semibold mb-2">
          ¡Bienvenido{currentUser?.firstName ? `, ${currentUser.firstName}` : ''}!
        </h2>
        <p className="text-dark-600">
          {isBrand 
            ? 'Gestiona tus campañas y encuentra Voicers para promover tu marca.' 
            : 'Explora campañas disponibles y promociona las marcas que te interesan.'}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-dark-100">
          <h3 className="text-dark-500 font-medium text-sm">
            {isBrand ? 'Campañas activas' : 'Participaciones activas'}
          </h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-dark-100">
          <h3 className="text-dark-500 font-medium text-sm">
            {isBrand ? 'Campañas completadas' : 'Participaciones completadas'}
          </h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-dark-100">
          <h3 className="text-dark-500 font-medium text-sm">
            {isBrand ? 'Voicers contratados' : 'Marcas promocionadas'}
          </h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-dark-100">
          <h3 className="text-dark-500 font-medium text-sm">
            {isBrand ? 'Gasto total' : 'Ganancia total'}
          </h3>
          <p className="text-2xl font-bold mt-1">$0</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-dark-100">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isBrand ? (
            <>
              <Link 
                to="/dashboard/campaigns/create" 
                className="btn-primary py-2 px-4 text-center"
              >
                Crear nueva campaña
              </Link>
              <Link 
                to="/dashboard/explore/voicers" 
                className="btn-outline py-2 px-4 text-center"
              >
                Explorar Voicers
              </Link>
              <Link 
                to="/dashboard/profile" 
                className="btn-outline py-2 px-4 text-center"
              >
                Editar perfil
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard/campaigns" 
                className="btn-primary py-2 px-4 text-center"
              >
                Ver campañas disponibles
              </Link>
              <Link 
                to="/dashboard/explore/brands" 
                className="btn-outline py-2 px-4 text-center"
              >
                Explorar Marcas
              </Link>
              <Link 
                to="/dashboard/profile" 
                className="btn-outline py-2 px-4 text-center"
              >
                Editar perfil
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Completar perfil si está incompleto */}
      {(!userProfile?.bio && !userProfile?.brandName) && (
        <div className="bg-yellow-50 rounded-lg shadow-sm p-6 mb-6 border border-yellow-200">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800">Completa tu perfil</h2>
          <p className="text-yellow-700 mb-4">
            Tu perfil está incompleto. Complétalo para aumentar tus oportunidades 
            {isBrand 
              ? ' de encontrar los mejores Voicers para tu marca.' 
              : ' de ser seleccionado para campañas.'}
          </p>
          <Link 
            to="/dashboard/profile" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
          >
            Completar perfil
          </Link>
        </div>
      )}

      {/* Campañas recientes o Participaciones recientes */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-dark-100">
        <h2 className="text-lg font-semibold mb-4">
          {isBrand ? 'Campañas recientes' : 'Participaciones recientes'}
        </h2>
        
        <div className="text-center py-8 text-dark-500">
          <p className="mb-4">
            {isBrand 
              ? 'Aún no has creado ninguna campaña.' 
              : 'Aún no has participado en ninguna campaña.'}
          </p>
          <Link 
            to={isBrand ? "/dashboard/campaigns/create" : "/dashboard/campaigns"} 
            className="btn-primary py-2 px-4"
          >
            {isBrand ? 'Crear primera campaña' : 'Explorar campañas disponibles'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 