const express = require('express');
const conection = require('../conection');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

// Listar todos los productos no vendidos
router.get('/vendidos', (req, res) => {
  conection.query(`SELECT p.id_producto AS producto, c.descripcion AS categoria, co.cod_consignacion AS consignaicon, co.cod_consignacion, p.precio, p.activo, p.talle, p.descripcion, p.id_producto, p.cod_producto
    FROM producto p
    INNER JOIN categoria c ON p.id_categoria = c.id_categoria 
    INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion
    WHERE p.activo = 'No'`, 
    function(error, results, fields) {
      if (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(results);
    });
});

// Listar todos los productos vendidos
router.get('/listar', (req, res) => {
  conection.query(`SELECT p.id_producto AS producto, c.descripcion AS categoria, co.cod_consignacion AS consignaicon, co.cod_consignacion, p.precio, p.activo, p.talle, p.descripcion, p.id_producto, p.cod_producto
    FROM producto p
    INNER JOIN categoria c ON p.id_categoria = c.id_categoria 
    INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion
    WHERE p.activo = 'Si'`, 
    function(error, results, fields) {
      if (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(results);
    });
});

router.get('/todos', (req, res) => {
  conection.query(`SELECT p.id_producto AS producto, c.descripcion AS categoria, co.cod_consignacion AS consignaicon, co.cod_consignacion, p.precio, p.activo, p.talle, p.descripcion, p.id_producto, p.cod_producto
    FROM producto p
    INNER JOIN categoria c ON p.id_categoria = c.id_categoria 
    INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion`, 
    function(error, results, fields) {
      if (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
        return;
      }
      res.json(results);
    });
});

//Crear producto
router.post('/register', (req, res) => {
  const {id_producto, id_categoria, id_consignacion, descripcion, talle, precio, activo } = req.body;
  const query = `INSERT INTO producto (id_producto, id_categoria, id_consignacion, descripcion, talle, precio, activo) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`;
  conection.query(query, [id_producto, id_categoria, id_consignacion, descripcion, talle, precio, activo], (error, results) => {
  if (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
    return;
  }
  console.log('Producto creado correctamente');
  res.status(201).json({ mensaje: 'Producto creado correctamente' });
  });
});

 // Ruta para el borrado lógico de un producto por su ID
 router.delete('/desactivar/:id_producto/', (req, res) => {
  const productoid = req.params.id_producto;
  const sql = 'UPDATE producto SET activo = ? WHERE id_producto = ?';
  const values = ['No', productoid];

  conection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error al cambiar el estado del producto:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'producto no encontrado' });
          return;
      }

      res.status(200).json({ message: 'Estado del producto cambiado exitosamente' });
  });
});

// Ruta para el borrado lógico de un producto por su ID
router.delete('/activar/:id_producto', (req, res) => {
  const productoid = req.params.id_producto;
  const sql = 'UPDATE producto SET activo = ? WHERE id_producto = ?';
  const values = ['Si', productoid];

  conection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error al cambiar el estado del producto:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'producto no encontrado' });
          return;
      }

      res.status(200).json({ message: 'Estado del producto cambiado exitosamente' });
  });
});

// Actualizar un producto por su ID
router.put('/update/:id_producto', (req, res) => {
    const productoId = req.params.id_producto;
    const {codigo,nombre,precio,activo} = req.body;
  
    // Query para actualizar un producto en la base de datos
    const query = `UPDATE producto SET codigo = ?, descripcion = ?, precio = ?, activo = ? WHERE id_producto = ?`;
    conection.query(query, [codigo,nombre,precio,activo, productoId], (error, results) => {
      if (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ mensaje: 'Error al actualizar producto' });
        return;
      }
      console.log('Producto actualizado correctamente');
      res.json({ mensaje: 'Producto actualizado correctamente' });
    });
  });

  // Ruta para cambiar el estado de un producto a activo o no activo
router.put('/activo/:id_producto', (req, res) => {
  const { id_producto } = req.params;
  const nuevoEstado = 'No';

  // Realizar la actualización en la base de datos
  conection.query('UPDATE producto SET activo = ? WHERE id_producto = ?', [nuevoEstado, id_producto], (error, results) => {
    if (error) {
      console.error('Error al actualizar el estado del producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    console.log(`Estado del producto ${id_producto} actualizado correctamente`);
    res.json({ message: 'Estado del producto actualizado correctamente' });
  });
});

module.exports = router;
