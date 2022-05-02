import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next)=>{

    let token;
    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){

        try {
            
            //intentamos decifrar el token
            token = req.headers.authorization.split(' ')[1]
            
            //el token que nos devuelve la web
            //el token viene con la palabrar bearer al iniicono, con el split la cortmos por el espacio entre esta y el token y nos devuelve un array y de ahi tomamos el token que esta en el index 1
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //decodificamos el token y necesitamos llamar denuevo a la palabra  que encripta
            //const veterinario
            req.veterinario = await Veterinario.findById(decoded.id).select(
                '-password -token -con'
                );
            
            return next();
        } catch (error) {
            const e = new Error('token no valido');//
           return res.status(403).json({msg: e.message})
        }
        //al usat los bearer token, nos tenemos que asegurar que el sv nos devuelava un bearer
        console.log('Si tiene el token con bearer')
    }

    if(!token){
    const error = new Error('token no valido o inexistente');
    res.status(403).json({msg: error.message})
    }
    next();
}

export default checkAuth