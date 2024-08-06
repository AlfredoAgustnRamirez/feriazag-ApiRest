const express = require('express');
const conection = require('../conection');
const router = express.Router();

router.post('/reservar', async (req, res) => {
  const { cliente, productos } = req.body; 

  const productosArray = Array.isArray(productos) ? productos : Object.values(productos);
  const reservasExitosas = [];
  const errores = [];

  for (const producto of productosArray) {
      const idproducto = producto.idproducto;

      const insertQuery = 'INSERT INTO reserva (idproducto, cliente, fecha) VALUES (?, ?, CURRENT_DATE())';

      try {
          await conection.query(insertQuery, [idproducto, cliente]);

          const updateQuery = 'UPDATE producto SET activo = "No", reservado = "Si" WHERE idproducto = ?';

          try {
              await conection.query(updateQuery, [idproducto]);
              reservasExitosas.push(idproducto);
          } catch (err) {
              console.error(err);
              errores.push({ idproducto, error: 'Error al actualizar el estado del producto' });
          }
      } catch (err) {
          console.error(err);
          errores.push({ idproducto, error: 'Error al realizar la reserva' });
      }
  }

  const respuesta = {
      exito: reservasExitosas.length > 0,
      reservasExitosas: reservasExitosas,
      errores: errores
  };

  res.status(200).json(respuesta);
});

//Listar Reservados
router.get("/listar", (req, res) => {
  conection.query(`SELECT r.idreserva, r.idproducto, r.cliente, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
   p.codproducto, p.descripcion, p.precio
  FROM reserva r
  INNER JOIN producto p ON r.idproducto = p.idproducto`, 
  function (error, results, fields) {
    if (error) {
      console.error("Error al obtener los productos reservados:", error);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.json(results);
  });
});


module.exports = router;