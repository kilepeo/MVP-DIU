import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Portada from '../../components/Portada.jsx';
import BotonPrestamoDigital from './BotonPrestamoDigital.jsx';
import { buscarLibros, libroPorId } from '../../data/libros';
import { fmtFecha } from '../../utils/fechas';
import './digital.css';

export default function BibliotecaDigital() {
  const { user, prestamos, diasPrestamoDigital } = useApp();
  const [q, setQ] = useState('');

  const digitales = useMemo(() => buscarLibros(q).filter((l) => l.digital), [q]);
  const misLibros = user ? prestamos.map((p) => ({ p, libro: libroPorId(p.libroId) })).filter((x) => x.libro) : [];

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Biblioteca digital</h1>
        <p>
          Libros electrónicos para leer en línea. Los pides prestados por {diasPrestamoDigital} días y empiezas a leer al instante.
          ¿Buscas un libro impreso? Ve al <Link to="/catalogo">catálogo de libros físicos</Link>.
        </p>
      </div>

      {misLibros.length > 0 && (
        <section className="card" style={{ marginBottom: 22 }} aria-labelledby="mis-prestamos">
          <h2 id="mis-prestamos">Mis préstamos</h2>
          <ul className="prestamos-lista">
            {misLibros.map(({ p, libro }) => (
              <li key={p.id}>
                <Portada libro={libro} />
                <div className="libro-info">
                  <h3>{libro.titulo}</h3>
                  <p className="muted">Hasta el {fmtFecha(p.hasta)} · Vas en la página {p.pagina}</p>
                </div>
                <Link className="btn btn-primary btn-sm" to={`/digital/leer/${libro.id}`}>Seguir leyendo</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form className="card buscador-digital" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="campo grow" style={{ marginBottom: 0 }}>
          <label htmlFor="d-q">Buscar en la biblioteca digital</label>
          <input id="d-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Título, autor o materia" />
        </div>
        {q && <button type="button" className="btn btn-ghost" onClick={() => setQ('')}>Limpiar</button>}
      </form>

      <h2 className="digital-titulo">{digitales.length} {digitales.length === 1 ? 'libro disponible' : 'libros disponibles'}</h2>

      {digitales.length === 0 ? (
        <div className="card vacio">
          <p>No encontramos libros digitales con esa búsqueda.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setQ('')}>Ver todos</button>
        </div>
      ) : (
        <ul className="grid-digital">
          {digitales.map((l) => (
            <li key={l.id} className="card digital-item">
              <Portada libro={l} />
              <div className="libro-info">
                <h3>{l.titulo}</h3>
                <p className="muted">{l.autor} · {l.edicion} · {l.anio}</p>
                <span className="chip chip-info">Libro electrónico · lectura en línea</span>
                <div style={{ marginTop: 12 }}>
                  <BotonPrestamoDigital libro={l} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
