
const { TipoServicio, CategoriaServicio } = require("../constant/constantes");
const { analizarImagen } = require("../services/modeloIA");
const ResponseResult = require("../models/responseResult");
const VentaServicio = require("../models/ventaServicio");
const ServicioChaperio = require("../models/servicioChaperia");
const SeguimientoServicio = require("../models/seguimientoServicio");
const MarcaVehiculo = require("../models/marcaVehiculo");

class MarcaVehiculoCtrl {
  constructor() {}

  async obtenerMarcasVehiculo(req, res) {
    var response = new ResponseResult();
    try {
      
      const marcasVehiculo = await MarcaVehiculo.findAll();

      if (marcasVehiculo.length == 0) {
        response.ok = false;
        response.msg = "No hay marcas disponibles";
        return res.status(400).send(response.getResponseData());
      }

      response.ok = true;
      response.msg = "Marcas recuperadas exitosasmente";
      response.data = marcasVehiculo;
      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al obtener marcas de vehiculo";
      res.status(500).send(response.getResponseData());
    }
  }

}

module.exports = new MarcaVehiculoCtrl();
