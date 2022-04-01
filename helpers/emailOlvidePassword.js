import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Enviar email
    const { email, nombre, token } = datos;
    const info = await transporter.sendMail({
        from: 'APV - Administrador de pacientes veterinarios',
        to: email,
        subject: 'Recupera tu cuenta en APV',
        text: 'Recupera tu cuenta en APV',
        html: `
        <p>Hola ${nombre}, recupera tu cuenta en APV</p>
        <p>
            Genera un nuevo password en este enlace:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer mi cuenta</a>
        </p>
        `
    })

    console.log('Mensaje enviado: %s', info.messageId)
};

export default emailOlvidePassword