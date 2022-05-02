import nodemailer from 'nodemailer';

const emailRegistro = async (datos)=>{
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
          subject: 'Comprueba tu cuenta en APV',
          text: 'comprueba tu cuenta en apv',
          html:`<p>Hola: ${nombre}, comprueba tu cuenta en APV</P>
                <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
                
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
                `
      });

      console.log("mensaje enviado : %s", info.messageId    )
}

export default emailRegistro