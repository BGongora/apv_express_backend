import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        //Conectar con la base de datos
        const db = await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Mongo DB conectado en: ${url}`);
    } catch (error) {
        console.log(`Eerror: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;