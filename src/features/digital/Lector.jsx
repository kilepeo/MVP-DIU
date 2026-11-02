import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import BotonConfirmar from '../../components/BotonConfirmar.jsx';
import BotonPrestamoDigital from './BotonPrestamoDigital.jsx';
import { libroPorId } from '../../data/libros';
import { fmtFecha } from '../../utils/fechas';
import './digital.css';

const TOTAL = 24;

// Texto de relleno (lorem ipsum): el prototipo no incluye contenido real de los libros.
const PARRAFOS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
];

function Hoja({ n }) {
  return (
    <article className="hoja" data-page={n} id={`pag-${n}`}>
      {(n - 1) % 6 === 0 && <h2>Capítulo {Math.floor((n - 1) / 6) + 1}</h2>}
      {[0, 1, 2].map((i) => (
        <p key={i}>{PARRAFOS[(n * 3 + i) % PARRAFOS.length]}</p>
      ))}
      <footer className="hoja-num">{n}</footer>
    </article>
  );
}

export default function Lector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prestamoDe, guardarProgreso, devolverDigital } = useApp();

  const libro = libroPorId(id);
  const prestamo = libro ? prestamoDe(libro.id) : null;

  const [modo, setModo] = useState('pagina'); // 'pagina' | 'continuo'
  const [pagina, setPagina] = useState(prestamo?.pagina ?? 1);
  const [tam, setTam] = useState(2);
  const [salto, setSalto] = useState('');
  const contRef = useRef(null);

  const irA = (n) => {
    const destino = Math.min(TOTAL, Math.max(1, n));
    setPagina(destino);
    if (modo === 'continuo') {
      document.getElementById(`pag-${destino}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  // Guarda el progreso de lectura.
  useEffect(() => {
    if (libro && prestamo) guardarProgreso(libro.id, pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  // Teclas ← → en modo página.
  useEffect(() => {
    if (modo !== 'pagina') return undefined;
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') setPagina((p) => Math.min(TOTAL, p + 1));
      if (e.key === 'ArrowLeft') setPagina((p) => Math.max(1, p - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modo]);

  // Modo continuo: detecta qué página está a la vista y salta a la actual al activarlo.
  useEffect(() => {
    if (modo !== 'continuo' || !contRef.current) return undefined;
    document.getElementById(`pag-${pagina}`)?.scrollIntoView({ block: 'start' });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setPagina(Number(e.target.dataset.page))),
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    contRef.current.querySelectorAll('.hoja').forEach((h) => obs.observe(h));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  if (!libro || !libro.digital) {
    return (
      <div className="container page">
        <h1>No encontramos ese libro digital</h1>
        <Link className="btn btn-primary" to="/digital">Ir a la biblioteca digital</Link>
      </div>
    );
  }

  if (!prestamo) {
    return (
      <div className="container page">
        <Link to="/digital" className="volver">← Biblioteca digital</Link>
        <div className="card">
          <h1>Primero pide prestado “{libro.titulo}”</h1>
          <p className="muted">Para leerlo necesitas tenerlo en préstamo. Dura 7 días y puedes devolverlo cuando quieras.</p>
          <BotonPrestamoDigital libro={libro} />
        </div>
      </div>
    );
  }

  return (
    <div className="lector">
      <div className="lector-barra">
        <div className="container lector-barra-inner">
          <div className="lector-titulo">
            <Link to="/digital" className="volver" style={{ margin: 0 }}>← Biblioteca digital</Link>
            <strong>{libro.titulo}</strong>
            <span className="nota">Prestado hasta el {fmtFecha(prestamo.hasta)}</span>
          </div>

          <div className="lector-controles">
            <div className="segmentado" role="radiogroup" aria-label="Modo de lectura">
              <button type="button" role="radio" aria-checked={modo === 'pagina'} className={modo === 'pagina' ? 'activo' : ''} onClick={() => setModo('pagina')}>
                Una página
              </button>
              <button type="button" role="radio" aria-checked={modo === 'continuo'} className={modo === 'continuo' ? 'activo' : ''} onClick={() => setModo('continuo')}>
                Desplazamiento continuo
              </button>
            </div>

            <div className="grupo-tam" role="group" aria-label="Tamaño del texto">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTam((t) => Math.max(0, t - 1))} disabled={tam === 0} aria-label="Reducir texto">A−</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTam((t) => Math.min(4, t + 1))} disabled={tam === 4} aria-label="Aumentar texto">A+</button>
            </div>

            <form
              className="salto"
              onSubmit={(e) => {
                e.preventDefault();
                const n = Number(salto);
                if (n >= 1 && n <= TOTAL) irA(n);
                setSalto('');
              }}
            >
              <label htmlFor="ir-pag" className="nota">Ir a</label>
              <input id="ir-pag" type="number" min={1} max={TOTAL} value={salto} onChange={(e) => setSalto(e.target.value)} placeholder="Pág." />
              <button type="submit" className="btn btn-secondary btn-sm">Ir</button>
            </form>

            <BotonConfirmar
              etiqueta="Devolver libro"
              pregunta="¿Devolver este libro?"
              onConfirm={() => {
                devolverDigital(prestamo.id);
                navigate('/digital');
              }}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <p className="aviso info" style={{ marginTop: 16 }}>
          Vista de demostración: el prototipo muestra {TOTAL} páginas con texto de relleno, no el contenido real del libro.
        </p>

        <div className="lectura" style={{ fontSize: `${16 + tam * 2}px` }}>
          {modo === 'pagina' ? (
            <>
              <Hoja n={pagina} />
              <nav className="paginacion" aria-label="Paginación">
                <button type="button" className="btn btn-secondary" onClick={() => irA(pagina - 1)} disabled={pagina === 1}>← Anterior</button>
                <span>Página <strong>{pagina}</strong> de {TOTAL}</span>
                <button type="button" className="btn btn-primary" onClick={() => irA(pagina + 1)} disabled={pagina === TOTAL}>Siguiente →</button>
              </nav>
            </>
          ) : (
            <div ref={contRef}>
              {Array.from({ length: TOTAL }, (_, i) => <Hoja key={i + 1} n={i + 1} />)}
            </div>
          )}
        </div>
      </div>

      {modo === 'continuo' && (
        <div className="indicador-pagina" aria-live="polite">Página {pagina} de {TOTAL}</div>
      )}
    </div>
  );
}
