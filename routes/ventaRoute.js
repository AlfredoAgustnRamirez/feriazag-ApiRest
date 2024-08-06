const express = require('express');
const conection = require('../conection');
const router = express.Router();

//Listar todos los productos
router.get('/listar', (req, res) => {
    conection.query(`SELECT  p.id_producto AS producto, c.descripcion As categoria, co.cod_consignacion AS consignaicon, co.cod_consignacion,
             p.precio, p.activo, p.talle, p.descripcion, p.id_producto, p.cod_producto
             FROM producto p
             INNER JOIN categoria c ON p.id_categoria = c.id_categoria 
             INNER JOIN consignacion co ON p.id_consignacion = co.id_consignacion
             WHERE p.activo = 'Si'`, 
             function(error,results,fields){
        if (error) {
            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(results);
    });
});

// Registrar la venta
router.post('/register', (req, res) => {
    const { total_venta, iduser, detalles } = req.body;
    // Obtener la fecha actual
    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const queryCabecera = `INSERT INTO venta_cabecera (id_usuario, total_venta, fecha) 
    VALUES (?, ?, ?)`;
    conection.query(queryCabecera, [iduser, total_venta, fecha], (error, resultsCabecera) => {
        if (error) {
            console.error('Error al crear venta:', error);
            res.status(500).json({ mensaje: 'Error al crear venta' });
            return;
        }

        const idcabecera = resultsCabecera.insertId; // ID de la venta recién creada

        // Crear una lista de valores para la inserción concatenada en venta_detalle
        const productosValues = detalles.map(detalle => [idcabecera, detalle.id_producto, detalle.precio]);
        const placeholders = detalles.map(() => '(?, ?, ?)').join(', ');
        const queryDetalle = `INSERT INTO venta_detalle (id_cabecera, id_producto, precio) VALUES ${placeholders}`;
        conection.query(queryDetalle, productosValues.flat(), (error, resultsDetalle) => {
            if (error) {
                console.error('Error al agregar detalles de venta:', error);
                res.status(500).json({ mensaje: 'Error al crear venta' });
                return;
            }
            console.log('Detalles de venta agregados correctamente');
            console.log('Venta creada correctamente');
            res.status(201).json({ mensaje: 'Venta creada correctamente' });
        });
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
  
module.exports = router;