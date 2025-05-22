import React from 'react';
import { Link } from 'react-router-dom';
import HeroImage from '../assets/hero-image.svg';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Marketing boca a boca en la era digital
            </h1>
            <p className="mt-6 text-xl lg:text-2xl max-w-3xl">
              Conectamos marcas con personas influyentes a nivel local para crear campañas 
              de marketing genuinas y efectivas.
            </p>
            <div className="mt-10">
              <div className="flex space-x-4">
                <Link
                  to="/register/brand"
                  className="btn-secondary py-3 px-5 text-base"
                >
                  Soy una Marca
                </Link>
                <Link
                  to="/register/voicer"
                  className="btn-outline bg-transparent border-white text-white hover:bg-white/10 py-3 px-5 text-base"
                >
                  Quiero ser Voicer
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <img
              src={HeroImage || 'https://via.placeholder.com/600x400?text=WOM+Argentina'}
              alt="WOM Argentina Marketing"
              className="w-full h-auto max-w-md mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-dark-900 sm:text-4xl">
              Marketing basado en recomendaciones reales
            </h2>
            <p className="mt-4 text-xl text-dark-500 max-w-2xl mx-auto">
              Creamos conexiones auténticas entre marcas y voces locales influyentes
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-dark-100">
                <div className="w-12 h-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-dark-900">Conexión con Voicers auténticos</h3>
                <p className="mt-2 text-dark-500">
                  Conectamos tu marca con personas reales que tienen influencia en sus círculos sociales.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-dark-100">
                <div className="w-12 h-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-dark-900">Métricas transparentes</h3>
                <p className="mt-2 text-dark-500">
                  Obtén datos claros sobre el rendimiento de tus campañas y el alcance real.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-dark-100">
                <div className="w-12 h-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-dark-900">Pagos seguros y transparentes</h3>
                <p className="mt-2 text-dark-500">
                  Sistema de pagos simple y seguro tanto para marcas como para Voicers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 px-4 bg-dark-50 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-dark-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-xl text-dark-500 max-w-2xl mx-auto">
              En tres simples pasos potencia tu marca con recomendaciones auténticas
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-bold flex items-center justify-center mx-auto">
                  1
                </div>
                <h3 className="mt-6 text-xl font-medium text-dark-900">Crea tu campaña</h3>
                <p className="mt-2 text-dark-500">
                  Define tu objetivo, presupuesto y el perfil de Voicers que necesitas para tu campaña.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-bold flex items-center justify-center mx-auto">
                  2
                </div>
                <h3 className="mt-6 text-xl font-medium text-dark-900">Conecta con Voicers</h3>
                <p className="mt-2 text-dark-500">
                  Selecciona Voicers auténticos que representen los valores de tu marca y se conecten con tu audiencia.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-bold flex items-center justify-center mx-auto">
                  3
                </div>
                <h3 className="mt-6 text-xl font-medium text-dark-900">Mide los resultados</h3>
                <p className="mt-2 text-dark-500">
                  Obtén análisis detallados del rendimiento de tu campaña y el impacto generado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:py-24 sm:px-6 lg:px-8 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            ¿Listo para impulsar tu marca?
          </h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Únete a WOM Argentina y transforma la forma en que tu marca se conecta con su audiencia.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="btn-secondary py-3 px-8 text-lg"
            >
              Empieza ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 