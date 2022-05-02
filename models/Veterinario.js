import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarID from "../helpers/generarID.js";



const vetSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    telefono:{
        type:String,
        default:null,
        trim:true
    },
    web:{
        type:String,
        default:null,
    },
    token:{
        type:String,
        default: generarID()
    },
    confirmado:{
        type:Boolean,
        default:false
    }
});


vetSchema.pre('save',async function(next){
    //usamos function y no arrow function por la funciuoanlidad de la palabra reservada this
    //google it that shit

    if(!this.isModified('password')){
        next()//esto es parta si un pw esta hasheado, no lo vuelva a hashear
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
} )


vetSchema.methods.comprobarPassword = async function(passwordForm){
    return await bcrypt.compare(passwordForm, this.password)//compara el pw que ponemos en el form con el hasheado
    
}


const Veterinario = mongoose.model("Veterinario", vetSchema)

export default Veterinario