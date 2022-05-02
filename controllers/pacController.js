import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res)=>{

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id
    //capturamos la id con un checkauth y un token de validacion
    try {
        console.log(paciente)
        const pacientealmacenado = await paciente.save()
        res.json(pacientealmacenado)
    } catch (error) {
        console.log(error)
    }
};

const obtenerPacientes = async (req, res)=>{

    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario)
    res.json(pacientes)
};

const obtenerPaciente=async (req, res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        res.status(404).json({msg:"No encontrado"})
    }

    //revisamos que el paciente dsea del vet que esta haciendo la consukta
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        //nos devuelve un object, para evitar que no funcone la auth hay que stringear
       return res.json({msg_:'accion no valida'})
    }

    res.json(paciente)
};

const actualizarPaciente=async (req, res)=>{

    //hacemos la validacion
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        res.status(404).json({msg:"No encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
       return res.json({msg_:'accion no valida'})
    }

    //actualizar paciente

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    //el OR es en caso de que si no existe la modificacion, entonces devuelve el value que ya tenia

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }
};

const eliminarPaciente=async (req, res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        res.status(404).json({msg:"No encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
       return res.json({msg_:'accion no valida'})
    };

    try {
        await paciente.deleteOne();
        res.json({msg: 'paciente eliminado'})
    } catch (error) {
        console.log(error)
    }
};

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
    }