import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Portada from '../../components/Portada.jsx';
import BotonPrestamoDigital from '../digital/BotonPrestamoDigital.jsx';
import { libroPorId } from '../../data/libros';
import { fmtFecha, sumarDias, toISO } from '../../utils/fechas';
import './catalogo.css';

export default function FichaLibro() {
  const { id } = useParams();
  const location = useLocation();
  const { copiasDisponibles, tieneReservaFisica, reservarLibroFisico, requireAuth } = useApp();
  const [aviso, setAviso] = useState(null); // { tipo, texto }

  const libro = libroPorId(id);
  const volver = `/catalogo${location.state?.search ? `?${location.state.search}` : ''}`;

  if (!libro) {
    return (
      <div className="container page">
        <h1>No encontramos ese libro</h1>
        <Link className="btn btn-primary" to="/catalogo">Volver al catálogo</Link>
      </div>
    );
  }

  const reservar = (campus) =>
    requireAuth(() => {
      const res = reservarLibroFisico(libro, campus);
      if (!res.ok) {
        setAviso({ tipo: 'error', texto: res.error });
        return;
      }
      setAviso({
        tipo: 'ok',
        titulo: 'Copia reservada',
        texto: `Te guardamos una copia en ${campus}. Retírala en el mesón de la biblioteca hasta el ${fmtFecha(res.reserva.retirarHasta)} presentando tu credencial.`,
      });
    });

  return (
    <div className="container page">
      <Link to={volver} className="volver">← Volver a los resultados</Link>

      <header className="ficha-cabecera card">
        <Portada libro={libro} grande />
        <div>
          <h1>{libro.titulo}</h1>
          <p className="autor">{libro.autor}</p>
          <dl className="ficha-datos">
            <div><dt>Edición</dt><dd>{libro.edicion}</dd></div>
            <div><dt>Editorial</dt><dd>{libro.editorial}, {libro.anio}</dd></div>
            {libro.isbn && <div><dt>ISBN</dt><dd>{libro.isbn}</dd></div>}
            <div><dt>Materias</dt><dd>{libro.materias.join(' · ')}</dd></div>
          </dl>
        </div>
      </header>

      {aviso && (
        <div className={`aviso ${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
          {aviso.titulo && <h3>✓ {aviso.titulo}</h3>}
          <p>{aviso.texto}</p>
          {aviso.tipo === 'ok' && <Link className="btn btn-primary btn-sm" to="/mis-actividades">Ver mis reservas</Link>}
        </div>
      )}

      <section className="card" aria-labelledby="disp-titulo">
        <h2 id="disp-titulo">Estado y disponibilidad por campus</h2>
        <p className="muted">
          “Disponibles” son las copias que puedes reservar ahora mismo. La clasificación <strong>{libro.clasif}</strong> es el código que identifica al libro en los estantes.
        </p>
        <ul className="campus-filas">
          {libro.ejemplares.map((e) => {
            const disp = copiasDisponibles(libro, e.campus);
            const reservada = tieneReservaFisica(libro.id, e.campus);
            return (
              <li key={e.campus} className="campus-fila">
                <div className="campus-nombre">
                  <h3>{e.campus}</h3>
                  {reservada ? (
                    <span className="chip chip-info">Reservada por ti</span>
                  ) : disp > 0 ? (
                    <span className="chip chip-ok">{disp} de {e.total} disponibles</span>
                  ) : (
                    <span className="chip chip-no">Sin copias disponibles</span>
                  )}
                </div>
                <div className="campus-ubicacion">
                  <span className="etiqueta">Dónde encontrarlo</span>
                  <span>Piso {e.piso} · Sección {e.seccion} · Estante {e.estante}</span>
                  {disp === 0 && !reservada && e.diasDevolucion > 0 && (
                    <span className="nota">Próxima devolución estimada: {fmtFecha(toISO(sumarDias(new Date(), e.diasDevolucion)))}</span>
                  )}
                </div>
                <div className="campus-accion">
                  {reservada ? (
                    <Link className="btn btn-secondary" to="/mis-actividades">Ver mi reserva</Link>
                  ) : (
                    <button type="button" className="btn btn-primary" disabled={disp < 1} onClick={() => reservar(e.campus)}>
                      Hacer reserva
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card digital-bloque" aria-labelledby="dig-titulo" style={{ marginTop: 18 }}>
        <h2 id="dig-titulo">Copia digital</h2>
        {libro.digital ? (
          <>
            <p className="muted">Este título también está en la biblioteca digital: lo pides prestado por 7 días y lo lees en línea al instante.</p>
            <BotonPrestamoDigital libro={libro} />
          </>
        ) : (
          <p className="muted">Este título no tiene versión digital. Puedes reservar una copia física arriba.</p>
        )}
      </section>
    </div>
  );
}
