const COLORES = ['#0a3d7c', '#1b6b5a', '#7a3b69', '#9a4a1b', '#3d4f9a', '#5a6b1b'];

function indice(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h) % COLORES.length;
}

/** Portada simulada: bloque de color con las iniciales del título. */
export default function Portada({ libro, grande = false }) {
  const iniciales = libro.titulo
    .split(/[\s:]+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  return (
    <div
      className={`portada ${grande ? 'portada-grande' : ''}`}
      style={{ background: COLORES[indice(libro.id)] }}
      aria-hidden="true"
    >
      <span>{iniciales || libro.titulo[0]}</span>
    </div>
  );
}
