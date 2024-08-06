const express = require('express');
const conection = require('./conection');
const consignacionRoute = require('./routes/consignacionRoute');
const productoRoute = require('./routes/productoRoute');
const ventaRoute = require('./routes/ventaRoute');
const ventaDetalleRoute = require('./routes/ventaDetalleRoute');
const productoconsRoute = require('./routes/productoconsRoute');
const userRoute = require('./routes/userRoute');
const pagoRoute = require('./routes/pagoRoute');
const reservaRoute = require('./routes/reservaRoute');
const categoriaRoute = require('./routes/categoriaRoute');

const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use('/categoria', categoriaRoute);
app.use('/consignacion', consignacionRoute);
app.use('/producto', productoRoute);
app.use('/productocons', productoconsRoute);
app.use('/user', userRoute);
app.use('/pago', pagoRoute);
app.use('/reserva', reservaRoute);
app.use('/venta', ventaRoute);
app.use('/ventaDetalle', ventaDetalleRoute);

module.exports = app;
