import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePW from "../helpers/emailOlvidePW.js";



const registrar = async (req,res)=>{

    console.log(req.body)

    //const{email,password,nombre} = req.body//destructuring del body enviado por postman

    //revisar y prevenir usuarios duplicaos en base al email
    const {email, nombre}= req.body;
    const existeUsuario = await Veterinario.findOne({email});
        if(existeUsuario){
            const error = new Error('Usuario ya registrado');
            return res.status(400).json({msg: error.message})
        }

    try {
        //guardar nuevo vet con la inof del req.body del postman 
        const veterinario = new Veterinario(req.body);
        const vetGuardado = await veterinario.save();

        //Enviar el email 
        emailRegistro({
            email,
            nombre,
            token: vetGuardado.token
        })


        res.json(vetGuardado)
    } catch (error) {
        console.log(error);
    }
    
    
};

const perfil=(req,res)=>{
    const {veterinario} = req
    
    res.json(veterinario)//el req lo almacenamos desde el authMiddleware
};

const confirmar= async (req,res)=>{
    
    const {token} = req.params
    const usuarioConfirmar = await Veterinario.findOne({token})//buscamos el entre los user en base al token

    if(!usuarioConfirmar){
        const error = new Error ('Token no valido');
        return res.status(404).json({msg: error.message})
    };


    try {
        
        usuarioConfirmar.token= null;
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save();

        res.json({msg:'confirmando cuenta'});
        //gracias al try catchm si llegamos hasta este msg es xq la confirmacion se ejecuto correctamente
    } catch (error) {
        console.log(error);
    }
    console.log(usuarioConfirmar);
    
};


const auntenticar = async(req, res)=>{
    const {email, password} = req.body

    //comprobar que el usuario exista
    const usuario = await Veterinario.findOne({email});
    
    if(!usuario){
        const error = new Error ('EL usuario no existe');
        return res.status(404).json({msg: error.message})
    };

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error ('Cuenta NO confirmada');
        return res.status(403).json({msg: error.message})
    }
    
    //revisar el PW
    if(await usuario.comprobarPassword(password) ){
        //autenticar xq el usuario existe y es el pw correcto 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
        console.log('PassWord correcto')
    }else{
        const error = new Error ('El Password es incorecto');
        return res.status(404).json({msg: error.message});
    }
    
}

const olvidePassword = async (req,res)=>{
    const {email} = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        console.log('usuario inexistente')
        const error = new Error('el usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();
    
        //enviar email con instrucciones

        emailOlvidePW({
            email,
            nombre :existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: 'hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
};
const comprobarToken = async (req,res)=>{
    const {token}= req.params
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        //el token es de algun usuario existente
        res.json({msg: 'Token valikdo y el user existe'})
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }
};
const nuevoPassword = async (req,res)=>{
    const {token} = req.params
    const {password}= req.body;//nuevo password que coloca el usario

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un Error');
        return res.status(400).json({msg: error.message})
    };

    try {
        veterinario.token = null//borramos le token para que no se pueda acceder de nuevo
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "password modificado correctamnte"})
        console.log(veterinario)
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) =>{
    const veterinario = await Veterinario.findById(req.params.id)//encontramos el suario que estamos editando
    
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    const {email} = req.body
    if(veterinario.email !== req.body.email){//comprobamos si esta modificando el email
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('Ese email ya esta en uso')
        return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.telefono = req.body.telefono
        veterinario.web = req.body.web 

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)//la respuesta es esta

        
    } catch (error) {
        console.log(error)    
    }
}

const actualizarPassword = async (req, res)=>{
    //leer los datos 
    const {id}= req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body
    //comprobar que exista
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    //comprobar pwd
    if(await veterinario.comprobarPassword(pwd_actual)){
        //almacenar el nuevo
        veterinario.password = pwd_nuevo//en el model tenemos un presave ue lo hashea 
        await veterinario.save();
        res.json({
            msg:'password actualizado'
        })
    }else{
        const error = new Error('password incorrecto')
        return res.status(400).json({msg: error.message})
    }
    

}


export {
    registrar,
    perfil, confirmar,
    auntenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}