import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Salas from './pages/Salas';
import Reservas from './pages/Reservas';
import AdminSalas from './pages/Admin/SalasAdmin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      {/* Barra de navegación */}
      <Navbar />
      
      {/* Contenedor principal */}
      <div className="app-container">
        {/* Sistema de notificaciones */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {/* Sistema de rutas */}
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta para listado de salas */}
          <Route path="/salas" element={<Salas />} />
          
          {/* Ruta para reservas con parámetro salaId */}
          <Route path="/reservas/:salaId" element={<Reservas />} />
          
          {/* Ruta de administración */}
          <Route path="/admin/salas" element={<AdminSalas />} />
          
          {/* Ruta de fallback para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;