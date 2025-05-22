import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <Link to="/" className="text-2xl font-display font-bold text-white">
              WOM Argentina
            </Link>
            <p className="mt-2 text-dark-200 text-sm">
              Conectamos marcas con personas influyentes a nivel local para crear campañas
              de marketing efectivas mediante recomendaciones personales.
            </p>
            <div className="mt-4 flex space-x-3">
              <a href="https://instagram.com" className="text-dark-300 hover:text-primary-300" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.66.25 1.22.6 1.77 1.153.553.55.902 1.11 1.153 1.77.247.637.416 1.363.465 2.428.047 1.024.06 1.379.06 3.808 0 2.43-.013 2.784-.06 3.807-.049 1.065-.218 1.792-.465 2.428a4.89 4.89 0 01-1.153 1.77c-.55.554-1.11.902-1.77 1.153-.637.247-1.363.416-2.427.465-1.024.047-1.379.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.89 4.89 0 01-1.77-1.153 4.904 4.904 0 01-1.153-1.77c-.247-.636-.416-1.363-.465-2.428C2.013 15.099 2 14.744 2 12.315s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.88 4.88 0 011.153-1.771A4.894 4.894 0 015.45 3.156c.636-.246 1.363-.415 2.427-.464C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.964.044-1.484.207-1.831.344-.11.043-.212.087-.314.135a3.06 3.06 0 00-.676.467c-.208.208-.37.43-.676 1.212-.138.347-.3.867-.344 1.831-.047 1.023-.058 1.351-.058 3.807s.011 2.784.058 3.807c.044.964.207 1.484.344 1.831.043.11.087.212.135.314.159.308.335.57.676.911.341.341.603.517.911.676.102.048.204.092.314.135.364.154.867.3 1.831.344 1.023.047 1.351.058 3.807.058s2.784-.011 3.807-.058c.964-.044 1.484-.207 1.831-.344a3.285 3.285 0 00.989-.602c.208-.208.37-.43.676-1.212.138-.347.3-.867.344-1.831.047-1.023.058-1.351.058-3.807s-.011-2.784-.058-3.807c-.044-.964-.207-1.484-.344-1.831a2.91 2.91 0 00-.602-.989c-.208-.208-.43-.37-1.212-.676-.347-.138-.867-.3-1.831-.344-1.023-.047-1.351-.058-3.807-.058z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12.315 6.67a5.65 5.65 0 100 11.3 5.65 5.65 0 000-11.3zm0 9.335a3.685 3.685 0 110-7.37 3.685 3.685 0 010 7.37zm5.89-9.539a1.32 1.32 0 100 2.64 1.32 1.32 0 000-2.64z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-dark-300 hover:text-primary-300" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Enlaces útiles */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Enlaces útiles</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/como-funciona" className="text-dark-300 hover:text-white">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-dark-300 hover:text-white">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/registro/voicer" className="text-dark-300 hover:text-white">
                  Sé un Voicer
                </Link>
              </li>
              <li>
                <Link to="/registro/marca" className="text-dark-300 hover:text-white">
                  Para Marcas
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-dark-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Soporte */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Soporte</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/preguntas-frecuentes" className="text-dark-300 hover:text-white">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-dark-300 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-dark-300 hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-dark-300 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-dark-700">
          <p className="text-center text-dark-400 text-sm">
            &copy; {new Date().getFullYear()} WOM Argentina. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 