import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="not-found text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <Button 
        variant="primary" 
        onClick={() => navigate('/')}
        className="mt-3"
      >
        Volver al Inicio
      </Button>
    </div>
  );
}