
const { CategoriaServicio } = require("../constant/constantes");
const ResponseResult = require("../models/responseResult");
const ServicioChaperio = require("../models/servicioChaperia");
const Vehiculo = require("../models/vehiculo");
const MarcaVehiculoCtrl = require('./marcaVehiculoCtrl');

class ServicioChaperiaCtrl {
  constructor() {}


  async insertarServicio(req, res) {
    var response = new ResponseResult();
    try {

      if (!req.body) {
        response.ok = false;
        response.msg = "No se recibieron los parametros";
        return res.status(400).send(response.getResponseData());
      }

      let nombre = req.body.nombre;
      let iaLabel = req.body.iaLabel;
      let descripcion = req.body.descripcion;
      let tarifaBase = req.body.tarifaBase;
      let tipo = req.body.tipo;
      let idERP = req.body.idERP;

      const nuevoServicio = await this.insertarServicioBD(nombre, iaLabel, descripcion, tarifaBase, tipo, idERP);

      response.ok = true;
      response.msg = "Servicio insertado";
      response.data = nuevoServicio;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al insertar Servicio";
      res.status(500).send(response.getResponseData());
    }
  }


  async insertarServicioBD(nombre, iaLabel, descripcion, tarifaBase, tipo, idERP) {
    try {
      const nuevoServicio = await ServicioChaperio.create({
        nombre,
        iaLabel,
        descripcion,
        tarifaBase,
        tipo,
        idERP
      });
      return nuevoServicio;
    } catch (error) {
      throw error;
    }
  }

  async obtenerServicioXidERP(idERP) {
    try {
      
      const servicios = await ServicioChaperio.findAll({
        where : {
          idERP : idERP
        },
        raw : false
      });

      if(servicios.length == 0){
        return null;
      }

      return servicios[0];

    } catch (error) {
      throw error;
    }
  }


}

module.exports = new ServicioChaperiaCtrl();
