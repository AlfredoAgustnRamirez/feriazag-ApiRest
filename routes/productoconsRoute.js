const express = require('express');
const conection = require('../conection');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

// Ruta para insertar productos por consignación
router.post('/:id_consignacion', (req, res) => {
  const { id_consignacion } = req.params;

  // Obtener el código de consignación
  conection.query('SELECT cod_consignacion FROM consignacion WHERE id_consignacion = ?', [id_consignacion], (err, results) => {
    if (err) {
      console.error('Error al obtener el código de consignación:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Consignación no encontrada');
      return;
    }

    const codconsignacion = results[0].cod_consignacion;

    // Obtener el último código de producto para esta consignación
    conection.query('SELECT MAX(cast(substring(cod_producto, 3) as unsigned)) AS max_cod_producto FROM producto WHERE cod_producto LIKE ?', [`${codconsignacion}%`], (err, results) => {
      if (err) {
        console.error('Error al obtener el último código de producto:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }

      let max_cod_producto = results[0].max_cod_producto;
      let next_cod_producto;

      if (max_cod_producto !== null) {
        // Incrementar el número y generar el nuevo código de producto
        next_cod_producto = `${codconsignacion}${max_cod_producto + 1}`;
      } else {
        // Si no hay productos para esta consignación, comenzar desde 1
        next_cod_producto = `${codconsignacion}1`;
      }

      // Insertar el nuevo producto
      const {id_categoria, descripcion, talle, precio, activo } = req.body; // Obtener los datos del producto desde el cuerpo de la solicitud
      conection.query('INSERT INTO producto (cod_producto, id_consignacion, id_categoria, descripcion, talle, precio, activo) VALUES (?, ?, ?, ?, ?, ?, ?)', [next_cod_producto, id_consignacion, id_categoria, descripcion, talle, precio, activo], (err) => {
        if (err) {
          console.error('Error al insertar el producto:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }

        res.status(201).json({message: 'Producto insertado correctamente'});
      });
    });
  });
});

//Listar producto por consignacion
router.get('/todos/:id_consignacion', (req, res) => {
  const consignacionId = req.params.id_consignacion;
  const query = `SELECT c.descripcion AS categoria, co.cod_consignacion AS consignacion,p.id_consignacion, p.id_producto, p.descripcion, p.precio, p.talle, p.activo, p.id_categoria, p.cod_producto, co.cod_consignacion
  FROM producto p 
  INNER JOIN categoria c ON p.id_categoria = c.id_categoria
  INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion
  WHERE p.id_consignacion = ?`;
  conection.query(query, [consignacionId], function(error, results, fields){
      if (error) {
          console.error('Error al obtener los productos de la consignación:', error);
          res.status(500).send('Error interno del dor');
          return;servi
      }
      res.json(results);
  });
});

//Listar producto por consignacion
router.get('/:id_consignacion', (req, res) => {
  const consignacionId = req.params.id_consignacion;
  const query = `SELECT c.descripcion AS categoria, co.cod_consignacion AS consignacion,p.id_consignacion, p.id_producto, p.descripcion, p.precio, p.talle, p.activo, p.id_categoria, p.cod_producto, co.cod_consignacion
  FROM producto p 
  INNER JOIN categoria c ON p.id_categoria = c.id_categoria
  INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion
  WHERE p.id_consignacion = ? AND p.activo = 'Si'`;
  conection.query(query, [consignacionId], function(error, results, fields){
      if (error) {
          console.error('Error al obtener los productos de la consignación:', error);
          res.status(500).send('Error interno del dor');
          return;servi
      }
      res.json(results);
  });
});

//Listar producto por consignacion
router.get('/vendidos/:id_consignacion', (req, res) => {
  const consignacionId = req.params.id_consignacion;
  const query = `SELECT c.descripcion AS categoria, co.cod_consignacion AS consignacion,p.id_consignacion, p.id_producto, p.descripcion, p.precio, p.talle, p.activo, p.id_categoria, p.cod_producto, co.cod_consignacion
  FROM producto p 
  INNER JOIN categoria c ON p.id_categoria = c.id_categoria
  INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion
  WHERE p.id_consignacion = ? AND p.activo = 'No'`;
  conection.query(query, [consignacionId], function(error, results, fields){
      if (error) {
          console.error('Error al obtener los productos de la consignación:', error);
          res.status(500).send('Error interno del dor');
          return;servi
      }
      res.json(results);
  });
});


 // Ruta para el borrado lógico de un producto por su ID
 router.delete('/desactivar/:id_producto', (req, res) => {
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
  const {id_categoria, descripcion, talle, precio, activo } = req.body;

  // Query para actualizar un producto en la base de datos
  const query = `UPDATE producto SET id_categoria = ?, descripcion = ?, talle = ?, precio = ?, activo = ? WHERE id_producto = ?`;
  conection.query(query, [id_categoria, descripcion, talle, precio, activo, productoId], (error, results) => {
    if (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ mensaje: 'Error al actualizar producto' });
      return;
    }
    console.log('Producto actualizado correctamente');
    res.json({ mensaje: 'Producto actualizado correctamente' });
  });
});

module.exports = router;