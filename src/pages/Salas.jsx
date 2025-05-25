import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Container, 
  Row, 
  Col, 
  Button, 
  Alert, 
  Spinner,
  Form,
  InputGroup,
  Stack
} from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { subscribeToSalas } from '../services/salasService';

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;

    const setupRealtimeUpdates = async () => {
      try {
        unsubscribe = subscribeToSalas(
          (salasData) => {
            setSalas(salasData);
            setLoading(false);
          },
          (err) => {
            setError('Error en conexión en tiempo real: ' + err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        setError('Error al configurar actualizaciones: ' + err.message);
        setLoading(false);
      }
    };

    setupRealtimeUpdates();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredSalas = salas.filter(sala => 
    sala.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (showOnlyAvailable ? sala.disponibilidad : true)
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando salas disponibles...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="salas-container">
      <Stack direction="horizontal" gap={3} className="mb-4 flex-wrap">
        <h2 className="me-auto">Instalaciones Deportivas</h2>
        
        <div className="d-flex align-items-center gap-3">
          <Form.Check 
            type="switch"
            id="filter-available"
            label="Mostrar solo disponibles"
            checked={showOnlyAvailable}
            onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
            className="flex-shrink-0"
          />
          
          <InputGroup style={{ width: '250px' }} className="flex-shrink-0">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
      </Stack>
      
      {filteredSalas.length === 0 ? (
        <Alert variant="info" className="text-center">
          {searchTerm ? 
            'No se encontraron salas que coincidan con los filtros' : 
            'No hay salas registradas'}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredSalas.map((sala) => (
            <Col key={sala.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-primary">{sala.nombre}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {sala.ubicacion}
                  </Card.Subtitle>
                  <Card.Text>{sala.descripcion}</Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">
                        Capacidad: {sala.capacidad}
                      </span>
                      <span className={`badge ${
                        sala.disponibilidad ? 'bg-success' : 'bg-danger'
                      }`}>
                        {sala.disponibilidad ? 'Disponible' : 'Ocupada'}
                      </span>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={() => navigate(`/reservas/${sala.id}`)}
                      disabled={!sala.disponibilidad}
                    >
                      {sala.disponibilidad ? 'Reservar' : 'No disponible'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}