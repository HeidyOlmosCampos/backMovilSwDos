
const ResponseResult = require("../models/responseResult");
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


  async insertarMarca(req, res) {
    var response = new ResponseResult();
    try {

      if (!req.body) {
        response.ok = false;
        response.msg = "No se recibieron los parametros";
        return res.status(400).send(response.getResponseData());
      }
      
      const nombre = req.body.nombre;
      const porcentaje = req.body.porcentaje;
      const idERP = req.body.idERP;
      const nuevaMarca = await this.insertarMarcaVehiculoBD(nombre, porcentaje, idERP);

      response.ok = true;
      response.msg = "Marca insertada";
      response.data = nuevaMarca;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al insertar MarcaVehiculo";
      res.status(500).send(response.getResponseData());
    }
  }


  async insertarMarcaVehiculoBD(nombre, porcentaje, idERP) {
    try {
      const nuevaMarca = await MarcaVehiculo.create({ nombre, porcentaje, idERP });
      return nuevaMarca;
    } catch (error) {
      throw error;
    }
  }

  async obtenerMarcaVehiculoXidERP(idERP) {
    try {
      
      const marcasVehiculo = await MarcaVehiculo.findAll({
        where : {
          idERP : idERP
        },
        raw : false
      });

      if(marcasVehiculo.length == 0){
        return null;
      }

      return marcasVehiculo[0];

    } catch (error) {
      throw error;
    }
  }



}

module.exports = new MarcaVehiculoCtrl();
