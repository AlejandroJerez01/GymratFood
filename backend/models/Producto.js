const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Descripcion: { type: String },
  Calorias: { type: Number, required: true },
  Proteina: { type: Number, default: 0 },
  Carbohidratos: { type: Number, default: 0 },
  Grasas: { type: Number, default: 0 }
  
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);