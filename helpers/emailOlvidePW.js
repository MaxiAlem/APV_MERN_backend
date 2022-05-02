import nodemailer from 'nodemailer';


const emailOlvidePW = async (datos)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      console.log(datos)

      const {email, nombre, token} = datos//conseguidos desde el controller linea 29

      //Enviar el mail
      const info = await transporter.sendMail({
          from:"APV - administrador de pacientes de veterinatia",
          to: email,
          subject: 'Reestablece tu Password',
          text: 'Reestablece tu Password',
          html:`<p>Hola: ${nombre}, has solicitado reestablecer tu password</P>
                <p>sigue el siguiente enlace para generar un nuevo Password:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a></p>
                
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
                `
      });

      console.log("mensaje enviado : %s", info.messageId    )
}

export default emailOlvidePW