import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { fmtFecha } from '../../utils/fechas';

/**
 * Acción única para el préstamo digital: "Pedir prestado" y, apenas se concreta,
 * "Leer ahora". Se reutiliza en la biblioteca digital y en la ficha del catálogo.
 */
export default function BotonPrestamoDigital({ libro }) {
  const { prestamoDe, prestarDigital, requireAuth, diasPrestamoDigital } = useApp();
  const prestamo = prestamoDe(libro.id);
  const [error, setError] = useState('');
  const [reciente, setReciente] = useState(false);

  const pedir = () =>
    requireAuth(() => {
      const res = prestarDigital(libro);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setError('');
      setReciente(true);
    });

  if (prestamo) {
    return (
      <div className="digital-accion">
        {reciente && (
          <p className="aviso ok" role="status">
            ¡Listo! Tienes “{libro.titulo}” hasta el {fmtFecha(prestamo.hasta)}.
          </p>
        )}
        <div className="acciones-fila">
          <Link className="btn btn-primary" to={`/digital/leer/${libro.id}`}>Leer ahora</Link>
          <span className="nota">Prestado hasta el {fmtFecha(prestamo.hasta)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="digital-accion">
      {error && <p className="aviso error" role="alert">{error}</p>}
      <button type="button" className="btn btn-primary" onClick={pedir}>
        Pedir prestado por {diasPrestamoDigital} días
      </button>
    </div>
  );
}
