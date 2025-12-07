const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Faltan datos' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(400).json({ message: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword)
      return res.status(400).json({ message: 'Contraseña incorrecta' });

    const payload = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      msg: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
