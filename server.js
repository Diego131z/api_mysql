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

// Login
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

// Registro de usuario
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

// Listar operaciones
app.get('/listar', (req, res) => {
  pool.query('SELECT * FROM operaciones', (err, results) => {
    if (err) {
      console.error('❌ Error al listar:', err);
      return res.status(500).json({ success: false, message: 'Error al listar operaciones' });
    }

    res.json(results);
  });
});

// Registrar nueva operación
app.post('/registro', (req, res) => {
  const { cantidad, descripcion, fecha, idoperacion, monto, responsable } = req.body;
  pool.query(
    'INSERT INTO operaciones (cantidad, descripcion, fecha, idoperacion, monto, responsable) VALUES (?, ?, ?, ?, ?, ?)',
    [cantidad, descripcion, fecha, idoperacion, monto, responsable],
    (err, result) => {
      if (err) {
        console.error('❌ Error al registrar operación:', err);
        return res.status(500).json({ success: false, message: 'Error al registrar' });
      }

      res.status(201).json({ success: true, message: 'Registro exitoso' });
    }
  );
});

// Actualizar operación
app.put('/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { cantidad, descripcion, fecha, idoperacion, monto, responsable } = req.body;

  pool.query(
    'UPDATE operaciones SET cantidad = ?, descripcion = ?, fecha = ?, idoperacion = ?, monto = ?, responsable = ? WHERE id = ?',
    [cantidad, descripcion, fecha, idoperacion, monto, responsable, id],
    (err, result) => {
      if (err) {
        console.error('❌ Error al actualizar:', err);
        return res.status(500).json({ success: false, message: 'Error al actualizar' });
      }

      res.json({ success: true, message: 'Actualización exitosa' });
    }
  );
});

// Eliminar operación
app.delete('/eliminar/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM operaciones WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar' });
    }

    res.json({ success: true, message: 'Eliminación exitosa' });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
