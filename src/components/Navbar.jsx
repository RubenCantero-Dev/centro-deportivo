import { Link } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function NavbarComponent() {
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión", error)
    }
  }

  if (loading) return null

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Centro Deportivo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            
            {user && (
              <>
                <Nav.Link as={Link} to="/salas">Salas</Nav.Link>
              </>
            )}
            
            {user?.isAdmin && (
              <Nav.Link as={Link} to="/admin/salas">Administración</Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            ) : (
              <>
                <Navbar.Text className="me-2">
                  {user.isAdmin ? '👑 ' : ''}{user.email}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}