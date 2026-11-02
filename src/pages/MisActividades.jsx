import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import BotonConfirmar from '../components/BotonConfirmar.jsx';
import { libroPorId } from '../data/libros';
import { fmtFecha, fmtFechaLarga, hh } from '../utils/fechas';

export default function MisActividades() {
  const {
    user, abrirLogin, reservasSalas, cancelarReservaSala, reservasLibros, cancelarReservaLibro,
    prestamos, devolverDigital, reiniciarDemo,
  } = useApp();

  if (!user) {
    return (
      <div className="container page">
        <h1>Mis actividades</h1>
        <p>Ingresa con tu cuenta institucional para ver tus reservas y préstamos.</p>
        <button type="button" className="btn btn-primary" onClick={abrirLogin}>Ingresar</button>
      </div>
    );
  }

  const salas = [...reservasSalas].sort((a, b) => (a.fecha + a.inicio).localeCompare(b.fecha + b.inicio));

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Mis actividades</h1>
        <p>Todo lo que tienes reservado o prestado, en un solo lugar.</p>
      </div>

      <section className="card" style={{ marginBottom: 18 }}>
        <h2>Salas de estudio reservadas</h2>
        {salas.length === 0 ? (
          <p className="muted">No tienes reservas de sala. <Link to="/salas">Reservar una sala</Link></p>
        ) : (
          <ul className="actividad-lista">
            {salas.map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{r.salaNombre} · {r.campus}</strong> <span className="chip chip-info">Código {r.codigo}</span>
                  <div className="muted">{fmtFechaLarga(r.fecha)} · {hh(r.inicio)} a {hh(r.fin)} · Piso {r.piso}</div>
                </div>
                <BotonConfirmar etiqueta="Cancelar reserva" pregunta="¿Cancelar esta reserva?" onConfirm={() => cancelarReservaSala(r.id)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" style={{ marginBottom: 18 }}>
        <h2>Libros físicos reservados</h2>
        {reservasLibros.length === 0 ? (
          <p className="muted">No tienes libros físicos reservados. <Link to="/catalogo">Buscar en el catálogo</Link></p>
        ) : (
          <ul className="actividad-lista">
            {reservasLibros.map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{r.titulo}</strong>
                  <div className="muted">Retíralo en el mesón de {r.campus} hasta el {fmtFecha(r.retirarHasta)}.</div>
                </div>
                <BotonConfirmar etiqueta="Cancelar reserva" pregunta="¿Cancelar esta reserva?" onConfirm={() => cancelarReservaLibro(r.id)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" style={{ marginBottom: 18 }}>
        <h2>Préstamos de la biblioteca digital</h2>
        {prestamos.length === 0 ? (
          <p className="muted">No tienes libros digitales prestados. <Link to="/digital">Ir a la biblioteca digital</Link></p>
        ) : (
          <ul className="actividad-lista">
            {prestamos.map((p) => {
              const libro = libroPorId(p.libroId);
              if (!libro) return null;
              return (
                <li key={p.id}>
                  <div>
                    <strong>{libro.titulo}</strong>
                    <div className="muted">Prestado hasta el {fmtFecha(p.hasta)} · Vas en la página {p.pagina}</div>
                  </div>
                  <span className="acciones-fila">
                    <Link className="btn btn-primary btn-sm" to={`/digital/leer/${libro.id}`}>Leer</Link>
                    <BotonConfirmar etiqueta="Devolver" pregunta="¿Devolver este libro?" onConfirm={() => devolverDigital(p.id)} />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="nota">
        ¿Estás probando el prototipo? <BotonConfirmar etiqueta="Reiniciar datos de la demo" pregunta="¿Borrar todas las reservas y préstamos?" si="Sí, borrar" onConfirm={reiniciarDemo} className="btn btn-ghost btn-sm" />
      </p>
    </div>
  );
}
