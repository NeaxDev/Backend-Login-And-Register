import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${db.connection.host}: ${db.connection.port}`;
    console.log(`Mongo conectado en ${url}`);
  } catch (error) {
    console.log(`Error en la conexion a bd: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
