import express from "express";
import {
    registrar, perfil,
    confirmar, auntenticar,
    olvidePassword, comprobarToken,
    nuevoPassword, actualizarPerfil,
    actualizarPassword
} from "../controllers/vetController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();
//paginas publicas/ no se necesit estar autenticado para poder visitarlas

router.post('/', registrar)
router.get('/confirmar/:token', confirmar)//paramewtro dinamico
router.post('/login', auntenticar);
router.post('/olvide-password', olvidePassword);
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);
//se puede usar chaining para reducir las cantidad de linear de codigo

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)


//paginas privadas//chequeadas
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword )
export default router;
