import express from 'express';
import { 
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente 
} from '../controllers/pacController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(checkAuth ,agregarPaciente)
    //autentiucamos el vet del req. y desps lo capturamos de nuevo para buscar los pacientes
    .get(checkAuth, obtenerPacientes)

router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;