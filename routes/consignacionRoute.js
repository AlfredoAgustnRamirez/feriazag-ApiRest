const express = require('express');
const conection = require('../conection');
const router = express.Router();
const cors = require('cors');

router.use(express.json());
router.use(cors());

//Listar las consignaciones
router.get('/listar', (req, res) => {
    conection.query('SELECT * FROM consignacion', function(error,results,fields){
        if (error) {
            console.error('Error al obtener las consignaciones:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(results);
    });
});

//Obtener consignacion por ID
router.get('/:id_consignacion', (req, res) => {
    const consignacionId = req.params.idconsignacion;
    const query = `SELECT * FROM consignacion WHERE id_consignacion = ?`;
    conection.query(query, [consignacionId], (error, results) => {
      if (error) {
        console.error('Error al obtener consignacion:', error);
        res.status(500).json({ mensaje: 'Error al obtener consignacion' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ mensaje: 'Consignacion no encontrado' });
        return;
      }
  
      const consignacion = results[0];
      res.json(consignacion);
    });   
});

//Crear consignacion
router.post('/register', (req, res) => {
    const { cod_consignacion, nombre, apellido, instagram, domicilio, celular, cbuAlias, observacion, activo } = req.body;
    const query = `INSERT INTO consignacion (cod_consignacion, nombre, apellido, instagram, domicilio, celular, cbuAlias, observacion, activo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    conection.query(query, [cod_consignacion, nombre, apellido, instagram, domicilio, celular, cbuAlias, observacion, activo], (error, results) => {
    if (error) {
      console.error('Error al crear consignacion:', error);
      res.status(500).json({ mensaje: 'Error al crear consignacion' });
      return;
    }
    console.log('Consignacion creado correctamente');
    res.status(201).json({ mensaje: 'Consignacion creado correctamente' });
    });
});

// Actualizar una consignaciom por su ID
router.put('/update/:id_consignacion', (req, res) => {
    const consignacionId = req.params.id_consignacion;
    const { codigo, nombre, apellido, instagram, domicilio, celular, cbuAlias, observacion, activo } = req.body;
  
    // Query para actualizar una consignacion en la base de datos
    const query = `UPDATE consignacion SET codigo = ?, nombre = ?, apellido = ?,
    instagram = ?, domicilio = ?, celular = ?, cbuAlias = ?, observacion = ?, activo = ? WHERE id_consignacion = ?`;
    conection.query(query, [codigo, nombre, apellido, instagram,
    domicilio, celular, cbuAlias, observacion, activo, consignacionId], (error, results) => {
      if (error) {
        console.error('Error al actualizar consignacion:', error);
        res.status(500).json({ mensaje: 'Error al actualizar consignacion' });
        return;
      }
      console.log('Consignacion actualizado correctamente');
      res.json({ mensaje: 'Consignacion actualizado correctamente' });
    });
  });

// Ruta para el borrado lógico de una consignacion por su ID
router.delete('/desactivar/:id_consignacion', (req, res) => {
  const consignacionid = req.params.id_consignacion;

  const sql = 'UPDATE consignacion SET activo = ? WHERE id_consignacion = ?';
  const values = ['No', consignacionid];

  conection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error al cambiar el estado de la consignacion:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Consignacion no encontrado' });
          return;
      }

      res.status(200).json({ message: 'Estado de la consignacion cambiado exitosamente' });
  });
});

// Ruta para el borrado lógico de una consignacion por su ID
router.delete('/activar/:id_consignacion', (req, res) => {
  const consignacionid = req.params.id_consignacion;

  const sql = 'UPDATE consignacion SET activo = ? WHERE id_consignacion = ?';
  const values = ['Si', consignacionid];

  conection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error al cambiar el estado de la consignacion:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Consignacion no encontrado' });
          return;
      }

      res.status(200).json({ message: 'Estado de la consignacion cambiado exitosamente' });
  });
});


module.exports = router;

