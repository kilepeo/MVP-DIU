import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ocupadoBase, HORA_FIN } from '../data/salas';
import { PREFIJO_CAMPUS } from '../data/campus';
import { fmtFecha, hh, sumarDias, toISO } from '../utils/fechas';

const AppContext = createContext(null);

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible: la demo sigue funcionando en memoria */
    }
  }, [key, value]);
  return [value, setValue];
}

const uid = () => Math.random().toString(36).slice(2, 10);
const codigo = (prefijo) => `${prefijo}-${1000 + Math.floor(Math.random() * 9000)}`;
const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const MAX_PRESTAMOS_DIGITALES = 3;
const DIAS_PRESTAMO_DIGITAL = 7;
const DIAS_RETIRO_FISICO = 2;

export function AppProvider({ children }) {
  const [user, setUser] = usePersistentState('bibusm:user', null);
  const [reservasSalas, setReservasSalas] = usePersistentState('bibusm:salas', []);
  const [reservasLibros, setReservasLibros] = usePersistentState('bibusm:libros', []);
  const [prestamos, setPrestamos] = usePersistentState('bibusm:prestamos', []);
  const [loginOpen, setLoginOpen] = useState(false);
  const pendiente = useRef(null);

  /* ---------------- Sesión (una sola cuenta institucional para todo) ---------------- */

  const login = useCallback(
    (usuario, clave) => {
      const u = usuario.trim().toLowerCase();
      if (!u) return { ok: false, error: 'Ingresa tu usuario institucional.' };
      if (u.includes('@') && !/@(sansano\.)?usm\.cl$/.test(u)) {
        return { ok: false, error: 'Usa tu cuenta institucional (@usm.cl o @sansano.usm.cl), la misma de SIGA y Aula.' };
      }
      if (!clave) return { ok: false, error: 'Ingresa tu contraseña.' };
      const base = u.split('@')[0];
      const nombre = base.split(/[._-]/).filter(Boolean).map(capitalizar).join(' ');
      setUser({ usuario: base, nombre });
      setLoginOpen(false);
      const accion = pendiente.current;
      pendiente.current = null;
      if (accion) accion();
      return { ok: true };
    },
    [setUser]
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const abrirLogin = useCallback(() => setLoginOpen(true), []);

  const cerrarLogin = useCallback(() => {
    pendiente.current = null;
    setLoginOpen(false);
  }, []);

  /** Ejecuta la acción de inmediato si hay sesión; si no, pide ingresar y la retoma al terminar. */
  const requireAuth = useCallback(
    (accion) => {
      if (user) {
        accion();
        return;
      }
      pendiente.current = accion;
      setLoginOpen(true);
    },
    [user]
  );

  /* ---------------- Función 1: salas de estudio ---------------- */

  const estadoBloque = useCallback(
    (salaId, fecha, hora) => {
      if (reservasSalas.some((r) => r.salaId === salaId && r.fecha === fecha && hora >= r.inicio && hora < r.fin)) {
        return 'mia';
      }
      return ocupadoBase(salaId, fecha, hora) ? 'ocupado' : 'libre';
    },
    [reservasSalas]
  );

  const reservarSala = useCallback(
    ({ sala, fecha, inicio, duracion }) => {
      const fin = inicio + duracion;
      if (fin > HORA_FIN) {
        return { ok: false, error: `La biblioteca cierra a las ${hh(HORA_FIN)}. Elige un bloque más temprano o 1 hora.` };
      }
      for (let h = inicio; h < fin; h++) {
        if (estadoBloque(sala.id, fecha, h) !== 'libre') {
          return { ok: false, error: 'Alguno de esos bloques ya no está disponible. Elige otro horario.' };
        }
      }
      const choque = reservasSalas.find((r) => r.fecha === fecha && inicio < r.fin && fin > r.inicio);
      if (choque) {
        return {
          ok: false,
          error: `Ya tienes una reserva ese día de ${hh(choque.inicio)} a ${hh(choque.fin)} (${choque.salaNombre}, ${choque.campus}). Cancélala desde "Mis actividades" si quieres cambiarla.`,
        };
      }
      const reserva = {
        id: uid(),
        codigo: codigo(PREFIJO_CAMPUS[sala.campus]),
        salaId: sala.id,
        salaNombre: sala.nombre,
        campus: sala.campus,
        piso: sala.piso,
        fecha,
        inicio,
        fin,
      };
      setReservasSalas((prev) => [...prev, reserva]);
      return { ok: true, reserva };
    },
    [estadoBloque, reservasSalas, setReservasSalas]
  );

  const cancelarReservaSala = useCallback(
    (id) => setReservasSalas((prev) => prev.filter((r) => r.id !== id)),
    [setReservasSalas]
  );

  /* ---------------- Función 2: catálogo y reserva de copia física ---------------- */

  const copiasDisponibles = useCallback(
    (libro, campus) => {
      const e = libro.ejemplares.find((x) => x.campus === campus);
      if (!e) return 0;
      const reservadas = reservasLibros.filter((r) => r.libroId === libro.id && r.campus === campus).length;
      return Math.max(0, e.disponibles - reservadas);
    },
    [reservasLibros]
  );

  const tieneReservaFisica = useCallback(
    (libroId, campus) => reservasLibros.some((r) => r.libroId === libroId && r.campus === campus),
    [reservasLibros]
  );

  const reservarLibroFisico = useCallback(
    (libro, campus) => {
      if (tieneReservaFisica(libro.id, campus)) {
        return { ok: false, error: `Ya tienes una copia de este libro reservada en ${campus}.` };
      }
      if (copiasDisponibles(libro, campus) < 1) {
        return { ok: false, error: `Ya no quedan copias disponibles en ${campus}. Prueba en otro campus.` };
      }
      const reserva = {
        id: uid(),
        libroId: libro.id,
        titulo: libro.titulo,
        campus,
        retirarHasta: toISO(sumarDias(new Date(), DIAS_RETIRO_FISICO)),
      };
      setReservasLibros((prev) => [...prev, reserva]);
      return { ok: true, reserva };
    },
    [copiasDisponibles, setReservasLibros, tieneReservaFisica]
  );

  const cancelarReservaLibro = useCallback(
    (id) => setReservasLibros((prev) => prev.filter((r) => r.id !== id)),
    [setReservasLibros]
  );

  /* ---------------- Función 3: biblioteca digital ---------------- */

  const prestamoDe = useCallback((libroId) => prestamos.find((p) => p.libroId === libroId) || null, [prestamos]);

  const prestarDigital = useCallback(
    (libro) => {
      if (prestamos.some((p) => p.libroId === libro.id)) return { ok: true };
      if (prestamos.length >= MAX_PRESTAMOS_DIGITALES) {
        return {
          ok: false,
          error: `Llegaste al máximo de ${MAX_PRESTAMOS_DIGITALES} préstamos digitales a la vez. Devuelve uno desde "Mis actividades" para pedir otro.`,
        };
      }
      const prestamo = {
        id: uid(),
        libroId: libro.id,
        desde: toISO(new Date()),
        hasta: toISO(sumarDias(new Date(), DIAS_PRESTAMO_DIGITAL)),
        pagina: 1,
      };
      setPrestamos((prev) => [...prev, prestamo]);
      return { ok: true, prestamo };
    },
    [prestamos, setPrestamos]
  );

  const devolverDigital = useCallback(
    (id) => setPrestamos((prev) => prev.filter((p) => p.id !== id)),
    [setPrestamos]
  );

  const guardarProgreso = useCallback(
    (libroId, pagina) =>
      setPrestamos((prev) => prev.map((p) => (p.libroId === libroId ? { ...p, pagina } : p))),
    [setPrestamos]
  );

  const reiniciarDemo = useCallback(() => {
    setReservasSalas([]);
    setReservasLibros([]);
    setPrestamos([]);
  }, [setPrestamos, setReservasLibros, setReservasSalas]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      abrirLogin,
      cerrarLogin,
      loginOpen,
      requireAuth,
      reservasSalas,
      estadoBloque,
      reservarSala,
      cancelarReservaSala,
      reservasLibros,
      copiasDisponibles,
      tieneReservaFisica,
      reservarLibroFisico,
      cancelarReservaLibro,
      prestamos,
      prestamoDe,
      prestarDigital,
      devolverDigital,
      guardarProgreso,
      reiniciarDemo,
      diasPrestamoDigital: DIAS_PRESTAMO_DIGITAL,
      fmtFecha,
    }),
    [
      user, login, logout, abrirLogin, cerrarLogin, loginOpen, requireAuth,
      reservasSalas, estadoBloque, reservarSala, cancelarReservaSala,
      reservasLibros, copiasDisponibles, tieneReservaFisica, reservarLibroFisico, cancelarReservaLibro,
      prestamos, prestamoDe, prestarDigital, devolverDigital, guardarProgreso, reiniciarDemo,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
