import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { CAMPUS } from '../data/campus';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, abrirLogin, reservasSalas, reservasLibros, prestamos } = useApp();
  const [q, setQ] = useState('');
  const [campus, setCampus] = useState('San Joaquín');

  const buscar = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (campus) p.set('campus', campus);
    navigate(`/catalogo?${p.toString()}`);
  };

  const totalActividades = reservasSalas.length + reservasLibros.length + prestamos.length;

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>¿Qué necesitas hoy?</h1>
          <p>Busca un libro, reserva una sala de estudio o lee en línea. Todo en un solo lugar y con tu cuenta institucional.</p>
          <form className="buscador-inicio" onSubmit={buscar} role="search">
            <label htmlFor="home-q">Buscar en el catálogo</label>
            <input
              id="home-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Título, autor o materia. Ej.: The C++ Programming Language"
            />
            <label htmlFor="home-campus">Campus</label>
            <select id="home-campus" value={campus} onChange={(e) => setCampus(e.target.value)}>
              <option value="">Todos los campus</option>
              {CAMPUS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary btn-grande">Buscar libro</button>
          </form>
        </div>
      </section>

      <div className="container">
        <div className="servicios">
          <Link to="/salas" className="servicio">
            <span className="icono" aria-hidden="true">🪑</span>
            <h2>Reservar sala de estudio</h2>
            <p>Elige campus, día y capacidad, mira los bloques libres y reserva en pocos pasos.</p>
            <span className="ir">Reservar sala →</span>
          </Link>
          <Link to="/catalogo" className="servicio">
            <span className="icono" aria-hidden="true">📚</span>
            <h2>Consultar un libro físico</h2>
            <p>Catálogo de los libros que están en los campus: ve cuántas copias hay disponibles y dónde encontrarlas.</p>
            <span className="ir">Ir al catálogo →</span>
          </Link>
          <Link to="/digital" className="servicio">
            <span className="icono" aria-hidden="true">💻</span>
            <h2>Leer en la biblioteca digital</h2>
            <p>Libros electrónicos que puedes pedir prestados y leer al instante desde cualquier lugar.</p>
            <span className="ir">Ir a la biblioteca digital →</span>
          </Link>
        </div>

        {user && totalActividades > 0 && (
          <div className="aviso info resumen-actividad">
            <span>
              Tienes {reservasSalas.length} reserva(s) de sala, {reservasLibros.length} libro(s) físico(s) reservado(s) y {prestamos.length} préstamo(s) digital(es).
            </span>
            <Link className="btn btn-secondary btn-sm" to="/mis-actividades">Ver mis actividades</Link>
          </div>
        )}

        <div className="seccion dos-col">
          <section className="card">
            <h2>¿Catálogo o biblioteca digital?</h2>
            <p><strong>Catálogo:</strong> libros impresos que están en los campus. Puedes reservar una copia y retirarla en el mesón.</p>
            <p><strong>Biblioteca digital:</strong> libros electrónicos. Los pides prestados por 7 días y los lees en línea, sin ir a la biblioteca.</p>
          </section>
          <section className="card">
            <h2>Ingresa una sola vez</h2>
            <p>Para reservar necesitas tu <strong>cuenta institucional</strong> (la misma de SIGA y Aula USM). No hay que crear cuentas nuevas.</p>
            {user ? (
              <p className="chip chip-ok">Sesión iniciada como {user.nombre}</p>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={abrirLogin}>Ingresar con mi cuenta</button>
            )}
          </section>
        </div>

        <section className="seccion card">
          <h2>Otros servicios de la biblioteca</h2>
          <p className="muted">Estos servicios se solicitan directamente en el mesón de tu campus.</p>
          <ul className="lista-info">
            <li>Préstamo de calculadoras</li>
            <li>Préstamo de notebooks</li>
            <li>Juegos de mesa</li>
            <li>Televisores y salas de recreación</li>
            <li>Solicitud de adquisición de libros que no están en la colección</li>
            <li>Bases de datos y revistas científicas</li>
          </ul>
        </section>
      </div>
    </>
  );
}
