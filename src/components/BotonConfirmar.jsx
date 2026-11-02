import { useState } from 'react';

/** Botón que pide una confirmación en la misma línea antes de ejecutar una acción irreversible. */
export default function BotonConfirmar({ etiqueta, pregunta, si = 'Sí', onConfirm, className = 'btn btn-secondary btn-sm' }) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button type="button" className={className} onClick={() => setAbierto(true)}>
        {etiqueta}
      </button>
    );
  }
  return (
    <span className="confirmar-inline" role="group" aria-label={pregunta}>
      <span>{pregunta}</span>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => {
          setAbierto(false);
          onConfirm();
        }}
      >
        {si}
      </button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAbierto(false)}>
        No
      </button>
    </span>
  );
}
