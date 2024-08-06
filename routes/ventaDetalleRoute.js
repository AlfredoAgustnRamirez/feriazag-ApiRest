const express = require('express');
const conection = require('../conection');
const router = express.Router();

//Listar todas las ventas
router.get('/listar', (req, res) => {
    conection.query(`
        SELECT v.id_cabecera,v.fecha,p.cod_producto,p.descripcion, vd.precio 
        FROM venta_detalle vd
        INNER JOIN producto p ON vd.id_producto = p.id_producto 
        INNER JOIN venta_cabecera v ON vd.id_cabecera = v.id_cabecera
        ORDER BY v.id_cabecera, v.fecha
    `, 
    function(error, results, fields) {
        if (error) {
            console.error('Error al obtener los detalles:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Formatear la fecha utilizando toLocaleString()
        results.forEach(result => {
            result.fecha = new Date(result.fecha).toLocaleDateString();
        });
        // Enviar los resultados como JSON
        res.json(results);
    });
});

//Listar las ventas del dia
router.get('/listar/ventaDia', (req, res) => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split('T')[0];
    conection.query(`
        SELECT v.id_cabecera,v.fecha,p.cod_producto,p.descripcion,vd.precio 
        FROM venta_detalle vd
        INNER JOIN producto p ON vd.id_producto = p.id_producto 
        INNER JOIN venta_cabecera v ON vd.id_cabecera = v.id_cabecera
        WHERE DATE(v.fecha) = ?
        ORDER BY v.id_cabecera, v.fecha
    `, [fechaActual], // Pasar la fecha actual como parámetro
    function(error, results, fields) {
        if (error) {
            console.error('Error al obtener los detalles:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Formatear la fecha utilizando toLocaleString()
        results.forEach(result => {
            result.fecha = new Date(result.fecha).toLocaleDateString();
        });
        
        // Enviar los resultados como JSON
        res.json(results);
    });
});

//Listar ultimos 7 dias
router.get('/listar/ventaSemana', (req, res) => {
    // Obtener la fecha actual y la fecha de hace 7 días en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split('T')[0];
    const fechaHace7Dias = new Date();
    fechaHace7Dias.setDate(fechaHace7Dias.getDate() - 7);
    const fechaLimite = fechaHace7Dias.toISOString().split('T')[0];

    conection.query(`
        SELECT v.id_cabecera, v.fecha, p.cod_producto, p.descripcion, vd.precio 
        FROM venta_detalle vd
        INNER JOIN producto p ON vd.id_producto = p.id_producto 
        INNER JOIN venta_cabecera v ON vd.id_cabecera = v.id_cabecera
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        ORDER BY v.id_cabecera, v.fecha
    `, [fechaLimite, fechaActual], // Pasar las fechas como parámetros
    function(error, results, fields) {
        if (error) {
            console.error('Error al obtener los detalles:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Formatear la fecha utilizando toLocaleString()
        results.forEach(result => {
            result.fecha = new Date(result.fecha).toLocaleDateString();
        });
        
        // Enviar los resultados como JSON
        res.json(results);
    });
});

router.get('/listar/ventaMes', (req, res) => {
    // Obtener la fecha actual y la fecha de hace 30 días en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split('T')[0];
    const fechaHace30Dias = new Date();
    fechaHace30Dias.setDate(fechaHace30Dias.getDate() - 30);
    const fechaLimite = fechaHace30Dias.toISOString().split('T')[0];

    conection.query(`
        SELECT v.id_cabecera, v.fecha, p.cod_producto, p.descripcion, vd.precio 
        FROM venta_detalle vd
        INNER JOIN producto p ON vd.id_producto = p.id_producto 
        INNER JOIN venta_cabecera v ON vd.id_cabecera = v.id_cabecera
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        ORDER BY v.id_cabecera, v.fecha
    `, [fechaLimite, fechaActual], // Pasar las fechas como parámetros
    function(error, results, fields) {
        if (error) {
            console.error('Error al obtener los detalles:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Formatear la fecha utilizando toLocaleString()
        results.forEach(result => {
            result.fecha = new Date(result.fecha).toLocaleDateString();
        });
        
        // Enviar los resultados como JSON
        res.json(results);
    });
});

module.exports = router;