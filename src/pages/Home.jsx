import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <Container className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center mb-5 py-5">
        <h1 className="display-4 fw-bold mb-4">Centro Deportivo Universitario</h1>
        <p className="lead mb-4">Excelencia deportiva y formación integral para nuestra comunidad universitaria</p>
        <div className="d-flex justify-content-center gap-3">
          <Button as={Link} to="/salas" variant="primary" size="lg">Ver Instalaciones</Button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section mb-5">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Nuestra Misión</h2>
            <Row>
              <Col md={6} className="mb-4 mb-md-0">
                <div className="about-item p-3 h-100">
                  <h3 className="h4">🏆 Excelencia Deportiva</h3>
                  <p>Promovemos el desarrollo deportivo de alto rendimiento y la formación de atletas integrales.</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="about-item p-3 h-100">
                  <h3 className="h4">📚 Formación Integral</h3>
                  <p>Complementamos la formación académica con valores deportivos como disciplina y trabajo en equipo.</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>

      {/* Facilities Preview */}
      <section className="facilities-section mb-5">
        <h2 className="text-center mb-4">Nuestras Instalaciones</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 facility-card">
              <Card.Body>
                <div className="facility-icon mb-3">🏐</div>
                <Card.Title>Canchas Multiusos</Card.Title>
                <Card.Text>
                  Espacios para voleibol, baloncesto y fútbol sala con superficie profesional.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 facility-card">
              <Card.Body>
                <div className="facility-icon mb-3">🏊</div>
                <Card.Title>Piscina Semiolímpica</Card.Title>
                <Card.Text>
                  Piscina climatizada de 25 metros con carriles para natación competitiva.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 facility-card">
              <Card.Body>
                <div className="facility-icon mb-3">💪</div>
                <Card.Title>Gimnasio Completo</Card.Title>
                <Card.Text>
                  Equipamiento moderno para entrenamiento funcional y musculación.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <Button as={Link} to="/salas" variant="outline-primary">Ver Todas las Instalaciones</Button>
        </div>
      </section>

      {/* Schedule Info */}
      <section className="schedule-section mb-5">
        <Card className="border-0">
          <Card.Body className="p-4 text-center">
            <h2 className="mb-3">Horario de Atención</h2>
            <Row className="justify-content-center">
              <Col md={8}>
                <ul className="schedule-list list-unstyled">
                  <li>Lunes a Viernes: 6:00 am - 10:00 pm</li>
                  <li>Sábados: 8:00 am - 6:00 pm</li>
                  <li>Domingos: 8:00 am - 2:00 pm</li>
                </ul>
                <p className="text-muted">*Horarios sujetos a cambios en temporada vacacional</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
}