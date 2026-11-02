import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { CAMPUS } from '../../data/campus';
import { CATEGORIAS, HORA_FIN, HORA_INICIO, SALAS } from '../../data/salas';
import { fmtFechaLarga, hh, proximosDiasHabiles, toISO } from '../../utils/fechas';
import './salas.css';

const DIAS = proximosDiasHabiles(5);
const HORAS = Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => HORA_INICIO + i);

export default function ReservaSalas() {
  const { user, estadoBloque, reservarSala, requireAuth } = useApp();

  const [campus, setCampus] = useState('San Joaquín');
  const [fecha, setFecha] = useState(DIAS[0].iso);
  const [categoria, setCategoria] = useState('Todas');
  const [personas, setPersonas] = useState(1);
  const [duracion, setDuracion] = useState(1);
  const [sel, setSel] = useState(null); // { salaId, hora }
  const [error, setError] = useState('');
  const [confirmada, setConfirmada] = useState(null);

  const ahora = new Date();
  const esHoy = fecha === toISO(ahora);
  const esPasado = (h) => esHoy && h <= ahora.getHours();

  const salas = useMemo(
    () =>
      SALAS.filter(
        (s) =>
          s.campus === campus &&
          s.capacidad >= personas &&
          (categoria === 'Todas' || s.categoria === categoria)
      ),
    [campus, categoria, personas]
  );

  const bloqueLibre = (salaId, h) => estadoBloque(salaId, fecha, h) === 'libre' && !esPasado(h);

  const rangoValido = (salaId, hora) => {
    if (hora + duracion > HORA_FIN) return false;
    for (let h = hora; h < hora + duracion; h++) if (!bloqueLibre(salaId, h)) return false;
    return true;
  };

  const cambiarFiltro = (setter) => (e) => {
    setter(e.target.value);
    setSel(null);
    setError('');
  };

  const salaSel = sel ? SALAS.find((s) => s.id === sel.salaId) : null;
  const valido = sel ? rangoValido(sel.salaId, sel.hora) : false;

  const confirmar = () =>
    requireAuth(() => {
      const res = reservarSala({ sala: salaSel, fecha, inicio: sel.hora, duracion });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setConfirmada(res.reserva);
      setSel(null);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  const quitarFiltros = () => {
    setCategoria('Todas');
    setPersonas(1);
    setSel(null);
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Reservar sala de estudio</h1>
        <p>Elige campus, día y duración, toca un bloque libre y confirma. Una sola confirmación, sin pasos extra.</p>
      </div>

      {confirmada && (
        <div className="aviso ok confirmacion" role="status">
          <h2>✓ Reserva confirmada</h2>
          <dl className="datos-reserva">
            <div><dt>Código</dt><dd><strong>{confirmada.codigo}</strong></dd></div>
            <div><dt>Sala</dt><dd>{confirmada.salaNombre} · Piso {confirmada.piso} · {confirmada.campus}</dd></div>
            <div><dt>Día</dt><dd>{fmtFechaLarga(confirmada.fecha)}</dd></div>
            <div><dt>Horario</dt><dd>{hh(confirmada.inicio)} a {hh(confirmada.fin)}</dd></div>
          </dl>
          <p>
            Enviamos el comprobante a <strong>{user?.usuario}@sansano.usm.cl</strong>. Puedes verla o cancelarla cuando quieras desde “Mis actividades”.
          </p>
          <div className="acciones-fila">
            <Link className="btn btn-primary btn-sm" to="/mis-actividades">Ver mis reservas</Link>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConfirmada(null)}>Reservar otra sala</button>
          </div>
        </div>
      )}

      <section className="card filtros-salas" aria-label="Filtros">
        <div className="filtros">
          <div className="campo">
            <label htmlFor="f-campus">Campus</label>
            <select id="f-campus" value={campus} onChange={cambiarFiltro(setCampus)}>
              {CAMPUS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-cat">Tipo de sala</label>
            <select id="f-cat" value={categoria} onChange={cambiarFiltro(setCategoria)}>
              <option>Todas</option>
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-personas">Número de personas</label>
            <select id="f-personas" value={personas} onChange={(e) => { setPersonas(Number(e.target.value)); setSel(null); setError(''); }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <span className="etiqueta" id="f-dur-label">Duración de la reserva</span>
            <div className="segmentado" role="radiogroup" aria-labelledby="f-dur-label">
              {[1, 2].map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={duracion === d}
                  className={duracion === d ? 'activo' : ''}
                  onClick={() => { setDuracion(d); setError(''); }}
                >
                  {d} {d === 1 ? 'hora' : 'horas'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="campo" style={{ marginBottom: 0 }}>
          <span className="etiqueta" id="f-dia-label">Día</span>
          <div className="dias" role="radiogroup" aria-labelledby="f-dia-label">
            {DIAS.map((d) => (
              <button
                key={d.iso}
                type="button"
                role="radio"
                aria-checked={fecha === d.iso}
                className={`dia ${fecha === d.iso ? 'activo' : ''}`}
                onClick={() => { setFecha(d.iso); setSel(null); setError(''); }}
              >
                <small>{d.dia}</small>
                <strong>{d.numero}</strong>
                <small>{d.mes}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="salas-layout">
        <section aria-label="Salas disponibles">
          <div className="salas-cabecera">
            <h2>{salas.length} {salas.length === 1 ? 'sala' : 'salas'} en {campus}</h2>
            <ul className="leyenda" aria-label="Leyenda">
              <li><span className="muestra libre" /> Libre</li>
              <li><span className="muestra ocupado" /> Ocupado</li>
              <li><span className="muestra mia" /> Tu reserva</li>
              <li><span className="muestra seleccionado" /> Seleccionado</li>
            </ul>
          </div>

          {salas.length === 0 && (
            <div className="card vacio">
              <p>No hay salas en {campus} que cumplan con ese tipo y número de personas.</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={quitarFiltros}>Quitar filtros de tipo y personas</button>
            </div>
          )}

          {salas.map((sala) => {
            const libres = HORAS.filter((h) => bloqueLibre(sala.id, h)).length;
            return (
              <article key={sala.id} className="card sala">
                <header className="sala-cabecera">
                  <div>
                    <h3>{sala.nombre} · Piso {sala.piso}</h3>
                    <p className="muted">
                      {sala.categoria} · Hasta {sala.capacidad} personas
                    </p>
                  </div>
                  <div className="sala-meta">
                    {sala.equipamiento.map((e) => <span key={e} className="chip">{e}</span>)}
                    <span className={`chip ${libres ? 'chip-ok' : 'chip-no'}`}>
                      {libres ? `${libres} bloques libres` : 'Sin bloques libres'}
                    </span>
                  </div>
                </header>
                <div className="bloques" role="group" aria-label={`Bloques de ${sala.nombre}`}>
                  {HORAS.map((h) => {
                    const estado = estadoBloque(sala.id, fecha, h);
                    const pasado = esPasado(h);
                    const enSel = sel && sel.salaId === sala.id && h >= sel.hora && h < sel.hora + duracion;
                    const textoEstado = estado === 'libre' ? 'libre' : estado === 'mia' ? 'tu reserva' : 'ocupado';
                    return (
                      <button
                        key={h}
                        type="button"
                        className={`bloque ${estado} ${pasado ? 'pasado' : ''} ${enSel ? 'seleccionado' : ''}`}
                        disabled={estado !== 'libre' || pasado}
                        aria-pressed={Boolean(enSel)}
                        aria-label={`${hh(h)} a ${hh(h + 1)}, ${pasado ? 'ya pasó' : textoEstado}`}
                        onClick={() => { setSel({ salaId: sala.id, hora: h }); setError(''); setConfirmada(null); }}
                      >
                        {hh(h)}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        <aside className={`panel-reserva card ${sel ? 'con-seleccion' : ''}`} aria-live="polite">
          <h2>Tu reserva</h2>
          {!sel && (
            <ol className="pasos">
              <li>Elige campus, día y duración.</li>
              <li>Toca un bloque <strong>libre</strong> de la sala que prefieras.</li>
              <li>Revisa el resumen y confirma.</li>
            </ol>
          )}
          {sel && salaSel && (
            <>
              <dl className="datos-reserva">
                <div><dt>Sala</dt><dd>{salaSel.nombre} · Piso {salaSel.piso}</dd></div>
                <div><dt>Campus</dt><dd>{salaSel.campus}</dd></div>
                <div><dt>Día</dt><dd>{fmtFechaLarga(fecha)}</dd></div>
                <div>
                  <dt>Horario</dt>
                  <dd><strong>{hh(sel.hora)} a {hh(sel.hora + duracion)}</strong> ({duracion} {duracion === 1 ? 'hora' : 'horas'})</dd>
                </div>
              </dl>
              {!valido && (
                <p className="aviso error" role="alert">
                  Con {duracion} horas este bloque se cruza con otra reserva o con el cierre ({hh(HORA_FIN)}). Elige 1 hora u otro bloque.
                </p>
              )}
              {error && <p className="aviso error" role="alert">{error}</p>}
              {!user && <p className="nota" style={{ marginBottom: 10 }}>Para confirmar te pediremos tu cuenta institucional (la de SIGA y Aula).</p>}
              <button type="button" className="btn btn-primary btn-grande ancho" disabled={!valido} onClick={confirmar}>
                Confirmar reserva
              </button>
              <button type="button" className="btn btn-ghost btn-sm ancho" style={{ marginTop: 8 }} onClick={() => { setSel(null); setError(''); }}>
                Cambiar selección
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
