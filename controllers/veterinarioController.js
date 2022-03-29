import Veterinario from "../models/Veterinario.js";
import generarJWT from '../helpers/generarJWT.js';
import generarId from "../helpers/generarId.js";

const registrar = async (req, res) => {

    const { email } = req.body;

    //Prevenir usuarios duplicados
    const existeUSuario = await Veterinario.findOne({email});

    if(existeUSuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    
    const { veterinario } = req;
    
    res.json({perfil: veterinario});
};

const confirmar = async (req, res) => {
    const { token } = req.params;
    console.log(req.params);

    try {
        const existeUsuario = await Veterinario.findOne({token});

        if(!existeUsuario) {
            const error = new Error('Token no valido');
            return res.status(400).json({msg: error.message});
        } else {
            existeUsuario.token = null;
            existeUsuario.confirmado = true;

            await existeUsuario.save();
            res.json({msg: 'Usuario confirmado exitosamente'});
        }

    } catch (error) {
        console.log(error);
    }
    
}

const autenticar = async (req, res) => {

    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error('El usuario si existe');
        return res.status(403).json({msg: error.message});
    } 

    //Confirmar si el usuario está confirmado o no
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    try {
        //Revisar el password
        if(await usuario.comprobarPassword(password)) {
            //Autenticar
            res.json({token: generarJWT(usuario.id)});
        } else {
            const error = new Error('El password es incorrecto');
            return res.status(403).json({msg: error.message});
        }
    } catch (error) {
        console.log(error);
    }
    
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario) {
        const error = new Error('El usuario no existe');
        res.status(400).json({msg: error.message});
    } 
    
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.json({msg: 'Hemos envíado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async(req, res) => {
    const token = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido) {
        res.json({msg: 'El token es valido'})
    } else {
        const error = new Error('Token no valido');
        return res.status(403).json(error.message);
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});

    if( !veterinario ){
        const error = new Error('Hubo un error');
        return res.status(400).json({error: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}