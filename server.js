require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MySQL
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

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🎉');
});

// Registro de usuario
app.post('/register', (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(400).json({ success: false, message: 'Faltan campos' });
  }

  const sql = 'INSERT INTO usuarios (correo, clave) VALUES (?, ?)';
  db.query(sql, [correo, clave], (err, result) => {
    if (err) {
      console.error('❌ Error en registro:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
    return res.json({ success: true, message: 'Registro exitoso' });
  });
});

// Inicio de sesión
app.post('/login', (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(400).json({ success: false, message: 'Faltan campos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND clave = ?';
  db.query(sql, [correo, clave], (err, results) => {
    if (err) {
      console.error('❌ Error en login:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      return res.json({ success: false, message: 'Credenciales inválidas' });
    }
  });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
