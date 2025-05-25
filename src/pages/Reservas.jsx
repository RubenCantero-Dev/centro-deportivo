import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Container, 
  Button, 
  Alert, 
  Spinner,
  Form,
  Table,
  Modal,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  crearReserva,
  subscribeReservasPorSala,
  verificarDisponibilidad,
  finalizarReserva
} from '../services/reservasService';
import { getSalas } from '../services/salasService';

export default function Reservas() {
  const { salaId } = useParams();
  const navigate = useNavigate();
  const [sala, setSala] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    fecha: '',
    horaInicio: '08:00',
    horaFin: '09:00'
  });
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);

  // Cargar datos de la sala y suscribirse a reservas
  useEffect(() => {
    let unsubscribeReservas;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar datos de la sala
        const salasData = await getSalas();
        const salaData = salasData.find(s => s.id === salaId);
        
        if (!salaData) {
          toast.error('Sala no encontrada');
          navigate('/salas');
          return;
        }
        
        setSala(salaData);

        // 2. Suscribirse a reservas en tiempo real
        unsubscribeReservas = subscribeReservasPorSala(
          salaId,
          (reservasData) => {
            setReservas(reservasData);
            setLoading(false);
          },
          (error) => {
            toast.error('Error en conexión: ' + error.message);
            setLoading(false);
          }
        );

      } catch (err) {
        toast.error('Error al cargar datos: ' + err.message);
        setLoading(false);
      }
    };

    cargarDatos();

    return () => {
      if (unsubscribeReservas) unsubscribeReservas();
    };
  }, [salaId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidating(true);
    
    try {
      // Validación básica
      if (!form.nombre || !form.fecha) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      if (form.horaInicio >= form.horaFin) {
        toast.error('La hora de fin debe ser mayor a la hora de inicio');
        return;
      }

      // Verificar disponibilidad
      const disponible = await verificarDisponibilidad(
        salaId,
        form.fecha,
        form.horaInicio,
        form.horaFin
      );

      if (!disponible) {
        toast.error('El horario seleccionado no está disponible');
        return;
      }

      // Mostrar confirmación
      setReservaConfirmada({
        ...form,
        salaNombre: sala?.nombre,
        salaId
      });
      setShowConfirmation(true);
      
    } catch (err) {
      toast.error('Error al verificar disponibilidad: ' + err.message);
    } finally {
      setValidating(false);
    }
  };

  const confirmarReserva = async () => {
    try {
      await crearReserva(reservaConfirmada);
      toast.success('Reserva creada exitosamente!');
      setShowConfirmation(false);
      // No necesitamos actualizar reservas manualmente, la suscripción lo hace
    } catch (err) {
      toast.error('Error al crear reserva: ' + err.message);
    }
  };

  const handleFinalizarReserva = async (reservaId) => {
    if (window.confirm('¿Estás seguro de finalizar esta reserva?')) {
      try {
        await finalizarReserva(reservaId);
        toast.success('Reserva finalizada correctamente');
        // No necesitamos actualizar manualmente, la suscripción lo hace
      } catch (err) {
        toast.error('Error al finalizar reserva: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando información de reservas...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Encabezado con info de la sala */}
      {sala && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="text-primary">
              {sala.nombre}
              <Badge bg={sala.disponibilidad ? 'success' : 'danger'} className="ms-2">
                {sala.disponibilidad ? 'Disponible' : 'No disponible'}
              </Badge>
            </Card.Title>
            <Card.Text>{sala.descripcion}</Card.Text>
            <Card.Text>
              <strong>Ubicación:</strong> {sala.ubicacion} | 
              <strong> Capacidad:</strong> {sala.capacidad} personas
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <Row>
        {/* Formulario de reserva */}
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Nueva Reserva</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo *</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={form.nombre}
                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                    required
                    placeholder="Ej: Juan Pérez"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha *</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={form.fecha}
                    onChange={(e) => setForm({...form, fecha: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora inicio *</Form.Label>
                      <Form.Select
                        value={form.horaInicio}
                        onChange={(e) => setForm({...form, horaInicio: e.target.value})}
                        required
                      >
                        {Array.from({length: 12}, (_, i) => `${7 + i}:00`).map(hora => (
                          <option key={hora} value={hora}>{hora}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora fin *</Form.Label>
                      <Form.Select
                        value={form.horaFin}
                        onChange={(e) => setForm({...form, horaFin: e.target.value})}
                        required
                      >
                        {Array.from({length: 12}, (_, i) => `${8 + i}:00`).map(hora => (
                          <option key={hora} value={hora}>{hora}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={validating}
                  className="w-100"
                >
                  {validating ? 'Validando...' : 'Verificar Disponibilidad'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Listado de reservas activas */}
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Reservas Activas</Card.Title>
              {reservas.length === 0 ? (
                <Alert variant="info">No hay reservas activas para esta sala</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Horario</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map(reserva => (
                        <tr key={reserva.id}>
                          <td>{reserva.fecha?.toLocaleDateString()}</td>
                          <td>{reserva.horaInicio} - {reserva.horaFin}</td>
                          <td>{reserva.nombre}</td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleFinalizarReserva(reserva.id)}
                            >
                              Finalizar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmación */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Confirmar la siguiente reserva?</p>
          <ul>
            <li><strong>Sala:</strong> {reservaConfirmada?.salaNombre}</li>
            <li><strong>Fecha:</strong> {reservaConfirmada?.fecha}</li>
            <li><strong>Horario:</strong> {reservaConfirmada?.horaInicio} - {reservaConfirmada?.horaFin}</li>
            <li><strong>Nombre:</strong> {reservaConfirmada?.nombre}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmarReserva}>
            Confirmar Reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}