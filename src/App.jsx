import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import MisActividades from './pages/MisActividades.jsx';
import ReservaSalas from './features/salas/ReservaSalas.jsx';
import Catalogo from './features/catalogo/Catalogo.jsx';
import FichaLibro from './features/catalogo/FichaLibro.jsx';
import BibliotecaDigital from './features/digital/BibliotecaDigital.jsx';
import Lector from './features/digital/Lector.jsx';

function NoEncontrado() {
  return (
    <div className="container page">
      <h1>No encontramos esa página</h1>
      <p>Puede que el enlace esté desactualizado.</p>
      <Link className="btn btn-primary" to="/">Volver al inicio</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Función 1 */}
        <Route path="salas" element={<ReservaSalas />} />
        {/* Función 2 */}
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="catalogo/:id" element={<FichaLibro />} />
        {/* Función 3 */}
        <Route path="digital" element={<BibliotecaDigital />} />
        <Route path="digital/leer/:id" element={<Lector />} />
        <Route path="mis-actividades" element={<MisActividades />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
