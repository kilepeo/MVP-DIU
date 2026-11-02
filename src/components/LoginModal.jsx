import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function LoginModal() {
  const { loginOpen, login, cerrarLogin } = useApp();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (loginOpen) {
      setError('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [loginOpen]);

  useEffect(() => {
    if (!loginOpen) return;
    const onKey = (e) => e.key === 'Escape' && cerrarLogin();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loginOpen, cerrarLogin]);

  if (!loginOpen) return null;

  const enviar = (e) => {
    e.preventDefault();
    const res = login(usuario, clave);
    if (!res.ok) setError(res.error);
    else setClave('');
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && cerrarLogin()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-titulo">
        <h2 id="login-titulo">Ingresa con tu cuenta institucional</h2>
        <p className="muted">
          Es la misma cuenta que usas en SIGA y Aula USM. No necesitas crear una cuenta nueva y sirve para salas,
          catálogo y biblioteca digital.
        </p>
        <form onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor="login-usuario">Usuario institucional</label>
            <input
              id="login-usuario"
              ref={inputRef}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="nombre.apellido  o  nombre.apellido@sansano.usm.cl"
              autoComplete="username"
            />
          </div>
          <div className="campo">
            <label htmlFor="login-clave">Contraseña</label>
            <input
              id="login-clave"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="aviso error" role="alert">{error}</p>}
          <p className="nota">Demo: sirve cualquier usuario y contraseña.</p>
          <div className="modal-acciones">
            <button type="button" className="btn btn-ghost" onClick={cerrarLogin}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
