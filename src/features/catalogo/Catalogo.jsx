import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Portada from '../../components/Portada.jsx';
import { CAMPUS } from '../../data/campus';
import { buscarLibros } from '../../data/libros';
import './catalogo.css';

/** Chip de estado de un libro en un campus: disponibles / total. */
export function EstadoCopias({ libro, campus }) {
  const { copiasDisponibles } = useApp();
  const ej = libro.ejemplares.find((e) => e.campus === campus);
  if (!ej) return <span className="chip">No está en {campus}</span>;
  const disp = copiasDisponibles(libro, campus);
  if (disp === 0) return <span className="chip chip-no">{campus}: sin copias disponibles</span>;
  return (
    <span className={`chip ${disp === ej.total ? 'chip-ok' : 'chip-warn'}`}>
      {campus}: {disp} de {ej.total} {disp === 1 ? 'disponible' : 'disponibles'}
    </span>
  );
}

export default function Catalogo() {
  const { copiasDisponibles } = useApp();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const campus = params.get('campus') ?? '';
  const soloDisp = params.get('disp') === '1';
  const [texto, setTexto] = useState(q);

  useEffect(() => setTexto(q), [q]);

  const setParam = (clave, valor) => {
    const p = new URLSearchParams(params);
    if (valor) p.set(clave, valor);
    else p.delete(clave);
    setParams(p, { replace: true });
  };

  const buscar = (e) => {
    e.preventDefault();
    setParam('q', texto.trim());
  };

  const coincidencias = useMemo(() => buscarLibros(q), [q]);

  const resultados = coincidencias.filter((l) => {
    const ejemplares = campus ? l.ejemplares.filter((e) => e.campus === campus) : l.ejemplares;
    if (ejemplares.length === 0) return false;
    if (soloDisp) return ejemplares.some((e) => copiasDisponibles(l, e.campus) > 0);
    return true;
  });

  const ocultos = coincidencias.length - resultados.length;
  const stateSearch = params.toString();

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Catálogo de libros físicos</h1>
        <p>Busca un título y filtra por campus y disponibilidad para saber de inmediato dónde hay una copia.</p>
      </div>

      <form className="card buscador-catalogo" onSubmit={buscar} role="search">
        <div className="campo grow">
          <label htmlFor="c-q">Título, autor o materia</label>
          <input
            id="c-q"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej.: The C++ Programming Language"
          />
        </div>
        <div className="campo">
          <label htmlFor="c-campus">Campus</label>
          <select id="c-campus" value={campus} onChange={(e) => setParam('campus', e.target.value)}>
            <option value="">Todos los campus</option>
            {CAMPUS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Buscar</button>
        <label className="casilla filtro-disp">
          <input type="checkbox" checked={soloDisp} onChange={(e) => setParam('disp', e.target.checked ? '1' : '')} />
          Solo con copias disponibles
        </label>
      </form>

      <div className="resultados-cabecera">
        <h2>
          {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
          {q && <> para “{q}”</>}
          {campus && <> en {campus}</>}
        </h2>
        {(q || campus || soloDisp) && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setParams({}, { replace: true }); setTexto(''); }}>
            Limpiar búsqueda
          </button>
        )}
      </div>

      {ocultos > 0 && (
        <p className="aviso info">
          Ocultamos {ocultos} {ocultos === 1 ? 'resultado' : 'resultados'} por el filtro actual (campus o disponibilidad).{' '}
          <button type="button" className="enlace" onClick={() => { const p = new URLSearchParams(params); p.delete('campus'); p.delete('disp'); setParams(p, { replace: true }); }}>
            Verlos todos
          </button>
        </p>
      )}

      {resultados.length === 0 ? (
        <div className="card vacio">
          <h3>No encontramos libros con esa búsqueda</h3>
          <p className="muted">Revisa la ortografía o prueba con menos palabras. También puedes quitar los filtros.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setParams({}, { replace: true }); setTexto(''); }}>
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <ul className="lista-libros">
          {resultados.map((l) => (
            <li key={l.id} className="card libro-item">
              <Portada libro={l} />
              <div className="libro-info">
                <h3>
                  <Link to={`/catalogo/${l.id}`} state={{ search: stateSearch }}>{l.titulo}</Link>
                </h3>
                <p className="muted">{l.autor} · {l.edicion} · {l.anio}</p>
                <div className="chips">
                  {(campus ? [campus] : l.ejemplares.map((e) => e.campus)).map((c) => (
                    <EstadoCopias key={c} libro={l} campus={c} />
                  ))}
                  {l.digital && <span className="chip chip-info">También en biblioteca digital</span>}
                </div>
              </div>
              <Link className="btn btn-secondary btn-sm" to={`/catalogo/${l.id}`} state={{ search: stateSearch }}>
                Ver ficha
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
