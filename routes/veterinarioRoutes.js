import express from "express";
import { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}from '../controllers/veterinarioController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Área pública
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//Área privada
router.get('/perfil', checkAuth, perfil);

export default router;