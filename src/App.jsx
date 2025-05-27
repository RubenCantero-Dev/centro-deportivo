import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Salas from './pages/Salas';
import Reservas from './pages/reservas';
import AdminSalas from './pages/Admin/SalasAdmin';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter basename="/centro-deportivo">
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
          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/salas" element={
            <PrivateRoute>
              <Salas />
            </PrivateRoute>
          } />
          
          {/* Rutas de reservas - ambas versiones */}
          <Route path="/reservas" element={
            <PrivateRoute>
              <Reservas />
            </PrivateRoute>
          } />
          
          <Route path="/reservas/:salaId" element={
            <PrivateRoute>
              <Reservas />
            </PrivateRoute>
          } />
          
          <Route path="/admin/salas" element={
            <PrivateRoute>
              <AdminSalas />
            </PrivateRoute>
          } />
          
          {/* Ruta de fallback para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;