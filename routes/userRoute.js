const express = require('express');
const conection = require('../conection');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;

const jwt = require('jsonwebtoken'); // Importa jsonwebtoken

const router = express.Router();

router.use(express.json());
router.use(cors());

// Define la clave secreta directamente en el código
const JWT_SECRET = 'tu_secreto_super_seguro';

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son campos requeridos' });
  }

  // Promesa para obtener el usuario
  const getUser = (email) => {
    return new Promise((resolve, reject) => {
      const getUserQuery = 'SELECT id_usuario, email, password FROM usuarios WHERE email = ?';
      conection.query(getUserQuery, [email], (error, results) => {
        if (error) {
          reject('Error al obtener usuario');
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    const results = await getUser(email);

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const user = results[0];
    const hashedPassword = user.password;

    // Comparar la contraseña
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Generar token de sesión
    const token = jwt.sign({ userId: user.id_usuario }, JWT_SECRET, { expiresIn: '15min' });

    // Retornar el token y el ID de usuario
    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token, userId: user.id_usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


//Ruta para registrar usuario
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, usuario, password, activo } = req.body;

  if (!email || !password || !nombre || !apellido || !usuario || !activo) {
    return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
  }

  const checkEmailQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE email = ?';
  const values = [email];
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  conection.query(checkEmailQuery, values, async (err, result) => {
    if (err) {
      console.error('Error al verificar el correo electrónico:', err);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    const existingUserCount = result[0].count;

    if (existingUserCount > 0) {
      return res.status(409).json({ mensaje: 'El correo electrónico ya está registrado' });
    }

    const insertUserQuery = 'INSERT INTO usuarios (nombre, apellido, email, usuario, password, activo) VALUES (?, ?, ?, ?, ?, ?)';
    const insertValues = [nombre, apellido, email, usuario, hashedPassword, activo];

    conection.query(insertUserQuery, insertValues, (err, result) => {
      if (err) {
        console.error('Error al insertar usuario:', err);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      console.log('Usuario insertado correctamente');
      res.status(201).json({ mensaje: 'Usuario insertado correctamente', usuario: result.insertId });
    });
  });
});


//Listar los usuarios
router.get('/listar', (req, res) => {
  conection.query(`SELECT u.id_usuario AS usuarios,u.id_usuario, u.nombre, u.apellido, u.email, u.usuario, u.activo, pe.descripcion AS perfil, pe.descripcion	
    FROM usuarios u
    INNER JOIN perfil pe ON u.id_perfil = pe.id_perfil` , function(error,results,fields){
      if (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.json(results);
  });
});

// Ruta para el borrado lógico de un usuario por su ID
router.delete('/desactivar/:id_usuario', (req, res) => {
  const usuarioid = req.params.id_usuario;

  const sql = 'UPDATE usuarios SET activo = ? WHERE id_usuario = ?';
  const values = ['No', usuarioid];

  conection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error al cambiar el estado del usuario:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Usuario no encontrado' });
          return;
      }

      res.status(200).json({ message: 'Estado del usuario cambiado exitosamente' });
  });
});

// Ruta para el borrado lógico de un usuario por su ID
router.delete('/activar/:id_usuario', (req, res) => {
  const usuarioid = req.params.id_usuario;

  const sql = 'UPDATE usuarios SET activo = ? WHERE id_usuario = ?';
  const values = ['Si', usuarioid];

  conection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error al cambiar el estado del usuario:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Usuario no encontrado' });
          return;
      }

      res.status(200).json({ message: 'Estado del usuario cambiado exitosamente' });
  });
});

// Actualizar un usuario por su ID
router.put('/update/:id_usuario', async (req, res) => {
  const usuarioId = req.params.id_usuario;
  const { nombre, apellido, email, usuario, password, activo } = req.body;

  try {
    // Encriptar la contraseña solo si se proporciona una nueva contraseña
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Query para actualizar un usuario en la base de datos
    const query = `
      UPDATE usuarios 
      SET nombre = ?, apellido = ?, email = ?, usuario = ?, password = ?, activo = ? 
      WHERE id_usuario = ?
    `;
    conection.query(query, [nombre, apellido, email, usuario, hashedPassword, activo, usuarioId], (error, results) => {
      if (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar usuario' });
        return;
      }
      console.log('Usuario actualizado correctamente');
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ mensaje: 'Error al encriptar la contraseña' });
  }
});


module.exports = router;  

