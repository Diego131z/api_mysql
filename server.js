import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Ruta para login
app.post('/login', (req, res) => {
  const { correo, clave } = req.body;

  pool.query(
    'SELECT * FROM usuarios WHERE correo = ? AND clave = ?',
    [correo, clave],
    (err, results) => {
      if (err) {
        console.error('❌ Error en login:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }

      if (results.length > 0) {
        res.json({ success: true, message: 'Inicio de sesión exitoso' });
      } else {
        res.json({ success: false, message: 'Credenciales inválidas' });
      }
    }
  );
});

// Ruta para registro
app.post('/register', (req, res) => {
  const { correo, clave } = req.body;

  pool.query(
    'INSERT INTO usuarios (correo, clave) VALUES (?, ?)',
    [correo, clave],
    (err, result) => {
      if (err) {
        console.error('❌ Error en registro:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }

      res.status(201).json({ success: true, message: 'Usuario registrado' });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
