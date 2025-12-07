const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const verificarToken = require('../middleware/verificarToken');

// Crear producto (solo usuario autenticado)
router.post('/', verificarToken, async (req, res) => {
  try {
    const { Nombre, Descripcion, Calorias, Proteina, Carbohidratos, Grasas } = req.body;

    if (!Nombre || typeof Calorias === 'undefined') {
      return res.status(400).json({ message: 'Faltan campos obligatorios: Nombre o Calorias' });
    }

    const nuevo = new Producto({ 
      Nombre, Descripcion, Calorias, Proteina, Carbohidratos, Grasas 
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});


// Actualizar (solo creador)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    if (producto.creadoPor.toString() !== req.usuario.id) {
      return res.status(403).json({ message: 'Acción no permitida' });
    }

    const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar (solo creador)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    if (producto.creadoPor.toString() !== req.usuario.id) {
      return res.status(403).json({ message: 'Acción no permitida' });
    }

    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;