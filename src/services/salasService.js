import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseConfig';


export const getSalas = async () => {
  const querySnapshot = await getDocs(collection(db, 'salas'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToSalas = (onUpdate, onError) => {
  const q = collection(db, 'salas');
  
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const salas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(salas);
    },
    (error) => {
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};


export const addSala = async (sala) => {
  const docRef = await addDoc(collection(db, 'salas'), sala);
  return docRef.id;
};

export const updateSala = async (id, sala) => {
  await updateDoc(doc(db, 'salas', id), sala);
};

export const deleteSala = async (id) => {
  await deleteDoc(doc(db, 'salas', id));
};

export const updateDisponibilidad = async (id, disponible) => {
  await updateDoc(doc(db, 'salas', id), { disponibilidad: disponible });
};