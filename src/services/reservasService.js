import { 
  getDoc,
  doc,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Crea una nueva reserva
 * @param {Object} reserva - Datos de la reserva
 * @returns {Promise<string>} ID de la reserva creada
 */
export const crearReserva = async (reserva) => {
  try {
    const reservaRef = await addDoc(collection(db, 'reservas'), {
      ...reserva,
      fecha: Timestamp.fromDate(new Date(reserva.fecha)),
      estado: 'activa',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return reservaRef.id;
  } catch (error) {
    console.error("Error en crearReserva:", error);
    throw error;
  }
};

/**
 * Obtiene las reservas activas para una sala específica
 * @param {string} salaId - ID de la sala
 * @returns {Promise<Array>} Lista de reservas
 */
export const getReservasPorSala = async (salaId) => {
  const q = query(
    collection(db, 'reservas'),
    where('salaId', '==', salaId),
    where('estado', '==', 'activa')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    fecha: doc.data().fecha?.toDate() 
  }));
};

/**
 * Finaliza una reserva
 * @param {string} reservaId - ID de la reserva a finalizar
 * @returns {Promise<void>}
 */
export const finalizarReserva = async (reservaId) => {
  try {
    const reservaRef = doc(db, 'reservas', reservaId);
    await updateDoc(reservaRef, {
      estado: 'finalizada',
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error en finalizarReserva:", error);
    throw error;
  }
};

/**
 * Suscribe a cambios en las reservas de una sala específica
 * @param {string} salaId - ID de la sala
 * @param {function} callback - Función que recibe las reservas actualizadas
 * @returns {function} Función para cancelar la suscripción
 */
export const subscribeReservasPorSala = (salaId, callback) => {
  const q = query(
    collection(db, 'reservas'),
    where('salaId', '==', salaId),
    where('estado', '==', 'activa')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const reservas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate()
    }));
    callback(reservas);
  });

  return unsubscribe;
};

/**
 * Verifica si una sala está disponible en un horario específico
 * @param {string} salaId - ID de la sala
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} horaInicio - Hora de inicio en formato HH:MM
 * @param {string} horaFin - Hora de fin en formato HH:MM
 * @returns {Promise<boolean>} true si está disponible, false si no
 */
export const verificarDisponibilidad = async (salaId, fecha, horaInicio, horaFin) => {
  const fechaObj = new Date(fecha);
  const inicio = new Date(
    fechaObj.getFullYear(),
    fechaObj.getMonth(),
    fechaObj.getDate(),
    parseInt(horaInicio.split(':')[0]),
    parseInt(horaInicio.split(':')[1]) || 0
  );
  
  const fin = new Date(
    fechaObj.getFullYear(),
    fechaObj.getMonth(),
    fechaObj.getDate(),
    parseInt(horaFin.split(':')[0]),
    parseInt(horaFin.split(':')[1]) || 0
  );

  const q = query(
    collection(db, 'reservas'),
    where('salaId', '==', salaId),
    where('estado', '==', 'activa')
  );
  
  const querySnapshot = await getDocs(q);
  const reservas = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const reservaFecha = data.fecha.toDate();
    const [hIni, mIni] = data.horaInicio.split(':').map(Number);
    const [hFin, mFin] = data.horaFin.split(':').map(Number);
    
    return {
      inicio: new Date(
        reservaFecha.getFullYear(),
        reservaFecha.getMonth(),
        reservaFecha.getDate(),
        hIni,
        mIni
      ),
      fin: new Date(
        reservaFecha.getFullYear(),
        reservaFecha.getMonth(),
        reservaFecha.getDate(),
        hFin,
        mFin
      )
    };
  });
  
  return !reservas.some(reserva => 
    (inicio < reserva.fin && fin > reserva.inicio)
  );
};

/**
 * Obtiene todas las reservas activas (para panel de administración)
 * @returns {Promise<Array>} Lista de todas las reservas activas
 */
export const getTodasReservasActivas = async () => {
  const q = query(
    collection(db, 'reservas'),
    where('estado', '==', 'activa')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    fecha: doc.data().fecha?.toDate() 
  }));
};