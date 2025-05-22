import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/navigation/DashboardHeader';

const DashboardLayout = () => {
  const { currentUser, userProfile } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-50">
      {/* Sidebar para móviles */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentUser={currentUser}
        userProfile={userProfile}
        className="lg:hidden"
      />

      {/* Sidebar para escritorio */}
      <Sidebar 
        currentUser={currentUser}
        userProfile={userProfile}
        className="hidden lg:block"
      />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentUser={currentUser}
        />

        <main className="flex-1 overflow-y-auto bg-dark-50 p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 