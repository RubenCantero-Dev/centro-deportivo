import { useState, useEffect } from 'react'
import { Button, Table, Form, Modal } from 'react-bootstrap'
import { getSalas, addSala, updateSala, deleteSala } from '../../services/salasService'

export default function SalasAdmin() {
  const [salas, setSalas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentSala, setCurrentSala] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    ubicacion: '',
    disponibilidad: true
  })

  useEffect(() => {
    loadSalas()
  }, [])

  const loadSalas = async () => {
    const data = await getSalas()
    setSalas(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentSala) {
      await updateSala(currentSala.id, formData)
    } else {
      await addSala(formData)
    }
    setShowModal(false)
    loadSalas()
    resetForm()
  }

  const handleEdit = (sala) => {
    setCurrentSala(sala)
    setFormData({
      nombre: sala.nombre,
      descripcion: sala.descripcion,
      capacidad: sala.capacidad,
      ubicacion: sala.ubicacion,
      disponibilidad: sala.disponibilidad
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setCurrentSala(null)
    setFormData({
      nombre: '',
      descripcion: '',
      capacidad: '',
      ubicacion: '',
      disponibilidad: true
    })
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between mb-3">
        <h2>Administrar Salas</h2>
        <Button onClick={() => setShowModal(true)}>Agregar Sala</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {salas.map(sala => (
            <tr key={sala.id}>
              <td>{sala.nombre}</td>
              <td>{sala.descripcion}</td>
              <td>{sala.capacidad}</td>
              <td>{sala.ubicacion}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(sala)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => deleteSala(sala.id).then(loadSalas)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentSala ? 'Editar Sala' : 'Agregar Sala'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                value={formData.capacidad}
                onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Disponible"
                checked={formData.disponibilidad}
                onChange={(e) => setFormData({...formData, disponibilidad: e.target.checked})}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}