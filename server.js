require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

// LOGIN
app.post('/login', (req, res) => {
  const { correo, clave } = req.body;
  const query = 'SELECT * FROM usuarios WHERE correo = ? AND clave = ?';
  db.query(query, [correo, clave], (err, results) => {
    if (err || results.length === 0) {
      return res.json({ success: false, message: 'Credenciales inválidas' });
    }
    res.json({ success: true, message: 'Login exitoso' });
  });
});

// REGISTRO
app.post('/registro', (req, res) => {
  const { correo, clave } = req.body;
  const query = 'INSERT INTO usuarios (correo, clave) VALUES (?, ?)';
  db.query(query, [correo, clave], (err) => {
    if (err) {
      return res.json({ success: false, message: 'Error al registrar' });
    }
    res.json({ success: true, message: 'Usuario registrado' });
  });
});

// LISTAR OPERACIONES
app.get('/operaciones', (req, res) => {
  const query = 'SELECT * FROM operaciones';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, data: results });
  });
});

// AGREGAR OPERACIÓN
app.post('/operaciones', (req, res) => {
  const { cantidad, descripcion, fecha, idoperacion, monto, responsable } = req.body;
  const query = `
    INSERT INTO operaciones (cantidad, descripcion, fecha, idoperacion, monto, responsable)
    VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [cantidad, descripcion, fecha, idoperacion, monto, responsable], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al insertar' });
    res.json({ success: true, message: 'Operación agregada' });
  });
});

// EDITAR OPERACIÓN
app.put('/operaciones/:id', (req, res) => {
  const id = req.params.id;
  const { cantidad, descripcion, fecha, idoperacion, monto, responsable } = req.body;
  const query = `
    UPDATE operaciones SET cantidad = ?, descripcion = ?, fecha = ?, idoperacion = ?, monto = ?, responsable = ?
    WHERE id = ?`;
  db.query(query, [cantidad, descripcion, fecha, idoperacion, monto, responsable, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al editar' });
    res.json({ success: true, message: 'Operación actualizada' });
  });
});

// ELIMINAR OPERACIÓN
app.delete('/operaciones/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM operaciones WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al eliminar' });
    res.json({ success: true, message: 'Operación eliminada' });
  });
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
