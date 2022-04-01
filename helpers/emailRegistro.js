import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
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
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `
        <p>Hola ${nombre}, comprueba tu cuenta en APV</p>
        <p>
            Tu cuenta ya está lista, compruebala en este enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar mi cuenta</a>
        </p>
        `
    })

    console.log('Mensaje enviado: %s', info.messageId)
};

export default emailRegistro