import Paciente from '../models/Paciente.js';

const agregarPaciente = async (req, res) => {

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);

    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(paciente) {
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(403).json({error: error.message});
        } else {
            res.json(paciente);
        }
    } else {
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({error: error.message});
    }

}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(paciente) {
        //Verificar que el paciente pertenece al veterinario
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(403).json({error: error.message});
        } else {
            try {
                //Actualizar paciente
                const props = Object.keys(req.body);
                props.forEach(key => {
                    paciente[key] = req.body[key]; 
                });
                const pacienteActualizado = await paciente.save();
                console.log(pacienteActualizado)
                res.json(pacienteActualizado);
            } catch (error) {
                return res.status(500).json({error: error.message});
            }
        }
    } else {
        //No existe el paciente
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({error: error.message});
    }
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(paciente) {
        //Verificar que el paciente pertenece al veterinario
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(403).json({error: error.message});
        } else {
            try {
                //Eliminar paciente
                await paciente.deleteOne();
                res.json({msg: 'Paciente eliminado'});
            } catch (error) {
                return res.status(500).json({error: error.message});
            }
        }
    } else {
        //No existe el paciente
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({error: error.message});
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}