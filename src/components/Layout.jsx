import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { HORARIO_ATENCION } from '../data/campus';
import LoginModal from './LoginModal.jsx';

export default function Layout() {
  const { user, logout, abrirLogin } = useApp();
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span>
              <strong>Biblioteca USM</strong>
              <small>Universidad Técnica Federico Santa María</small>
            </span>
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menu}
            aria-controls="menu-principal"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? 'Cerrar' : 'Menú'}
          </button>
          <nav id="menu-principal" className={`main-nav ${menu ? 'open' : ''}`} aria-label="Principal">
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/salas">Salas de estudio</NavLink>
            <NavLink to="/catalogo">Catálogo</NavLink>
            <NavLink to="/digital">Biblioteca digital</NavLink>
            {user && <NavLink to="/mis-actividades">Mis actividades</NavLink>}
            <span className="nav-sesion">
              {user ? (
                <>
                  <span className="nav-usuario">Hola, {user.nombre}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
                </>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" onClick={abrirLogin}>Ingresar</button>
              )}
            </span>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p><strong>Biblioteca USM</strong> · Atención en mesón: {HORARIO_ATENCION}.</p>
          <p className="muted">
            Prototipo académico del curso Diseño de Interfaces Usuarias. Los libros, salas y disponibilidad son datos de demostración.
          </p>
        </div>
      </footer>

      <LoginModal />
    </>
  );
}
