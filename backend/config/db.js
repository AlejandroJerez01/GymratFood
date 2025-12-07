// config/db.js
const mongoose = require('mongoose');

// Cargar variables de entorno
require('dotenv').config();

// Tomar la URI desde el .env
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ ERROR: No se encontró MONGO_URI en el .env');
  process.exit(1);
}

const conectarDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Mostrar host y base conectada
    console.log('✅ MongoDB conectado a:');
    console.log('   Host:', mongoose.connection.host);
    console.log('   Base de datos:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
