const express = require('express');
const multer = require('multer');
const PreinspeccionCtrl = require('../controllers/preInspeccionCtrl');
const SeguimientoCtrl = require('../controllers/seguimientoCtrl');
const MarcaVehiculoCtrl = require('../controllers/marcaVehiculoCtrl');
const router = express.Router();


// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/calcularPrecioPreinspeccion', upload.single('image'), (req, res) => PreinspeccionCtrl.calcularPrecio(req, res));



router.get('/obtenerPorCodigoSeguimiento/:codigoSeguimiento', (req, res) => SeguimientoCtrl.obtenerPorCodigoDeSeguimiento(req, res));

router.get('/detalleSeguimientoServicio/:id', (req, res) => SeguimientoCtrl.obtenerDetalleSeguimiento(req, res));



router.get('/obtenerMarcasVehiculo', (req, res) => MarcaVehiculoCtrl.obtenerMarcasVehiculo(req, res));







module.exports = router;

