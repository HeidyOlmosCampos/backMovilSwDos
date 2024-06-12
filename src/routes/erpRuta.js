const express = require('express');

const MarcaVehiculoCtrl = require('../controllers/marcaVehiculoCtrl');
const VehiculoCtrl = require('../controllers/vehiculoCtrl');
const VentaServicioCtrl = require('../controllers/ventaServicioCtrl');
const ServicioChaperiaCtrl = require('../controllers/servicioChaperiaCtrl');
const router = express.Router();


router.post('/insertarMarca', (req, res) => MarcaVehiculoCtrl.insertarMarca(req, res));


router.post('/insertarVehiculo', (req, res) => VehiculoCtrl.insertarVehiculo(req, res));

router.post('/insertarServicio', (req, res) => ServicioChaperiaCtrl.insertarServicio(req, res));


//insertar venta
// - cabecera: venta servicio
// - detalle : seguimiento servicio
router.post('/insertarVenta', (req, res) => VentaServicioCtrl.insertarVenta(req, res));








module.exports = router;

