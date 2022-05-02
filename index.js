import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

import connectDB from "./config/db.js";

import vetRouter from "./routes/vetRoutes.js";//al ser un export default el import puede recibir cualquier nombre
import pacRouter from "./routes/pacRoutes.js"

const app = express();
app.use(express.json())//le avisamos que vamos a enviar datos  .json para eitar el undefined en express
dotenv.config();

connectDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions ={
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1 ){
            //el origne del request esta permitido(!== -1 no es igual a no estar)
            callback(null, true )
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use('/api/veterinarios', vetRouter);
app.use('/api/pacientes', pacRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server funcionando en el port: ${PORT}`)
})