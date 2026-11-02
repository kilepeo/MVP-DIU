export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const desdeISO = (iso) => new Date(`${iso}T12:00:00`);

export const sumarDias = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const fmtFecha = (iso) =>
  desdeISO(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });

export const fmtFechaLarga = (iso) => {
  const t = desdeISO(iso).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const hh = (h) => `${String(h).padStart(2, '0')}:00`;

/** Próximos n días hábiles (lunes a viernes), partiendo de hoy si corresponde. */
export function proximosDiasHabiles(n) {
  const out = [];
  let d = new Date();
  while (out.length < n) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      out.push({
        iso: toISO(d),
        dia: d.toLocaleDateString('es-CL', { weekday: 'short' }).replace('.', ''),
        numero: d.getDate(),
        mes: d.toLocaleDateString('es-CL', { month: 'short' }).replace('.', ''),
      });
    }
    d = sumarDias(d, 1);
  }
  return out;
}
