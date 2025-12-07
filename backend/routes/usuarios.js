const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/verificarToken');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ message: 'Correo ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
    await nuevoUsuario.save();

    const usuarioResp = nuevoUsuario.toObject();
    delete usuarioResp.password;

    const payload = { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(201).json({ usuario: usuarioResp, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos (público)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Actualizar (solo dueño)
router.put('/:id', verificarToken, async (req, res) => {
  if (req.usuario.id !== req.params.id) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password;
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar (solo dueño)
router.delete('/:id', verificarToken, async (req, res) => {
  if (req.usuario.id !== req.params.id) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;