
const { CategoriaServicio } = require("../constant/constantes");
const ResponseResult = require("../models/responseResult");
const Vehiculo = require("../models/vehiculo");
const MarcaVehiculoCtrl = require('./marcaVehiculoCtrl');

class VehiculoCtrl {
  constructor() {}


  async insertarVehiculo(req, res) {
    var response = new ResponseResult();
    try {

      if (!req.body) {
        response.ok = false;
        response.msg = "No se recibieron los parametros";
        return res.status(400).send(response.getResponseData());
      }

      const matricula = req.body.matricula;
      const color = req.body.color;
      const descripcion = req.body.descripcion;
      const nombreModelo = req.body.nombreModelo;
      const idERP = req.body.idERP;
      var MarcaVehiculoId = req.body.MarcaVehiculoId; //el que llega es del erp
      
      const MarcaVehiculo = await MarcaVehiculoCtrl.obtenerMarcaVehiculoXidERP(MarcaVehiculoId);

      if(!MarcaVehiculo){
        response.ok = false;
        response.msg = "Id de marca de vehiculo incorrecta: " + MarcaVehiculoId;
        return res.status(400).send(response.getResponseData());
      }

      MarcaVehiculoId = MarcaVehiculo.id; //modificar con el id correcto
      const nuevaMarca = await this.insertarVehiculoBD(matricula, color, descripcion, nombreModelo, idERP, MarcaVehiculoId);

      response.ok = true;
      response.msg = "Vehiculo insertado";
      response.data = nuevaMarca;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al insertar Vehiculo";
      res.status(500).send(response.getResponseData());
    }
  }


  async insertarVehiculoBD(matricula, color, descripcion, nombreModelo, idERP, MarcaVehiculoId) {
    try {
      const nuevoVehiculo = await Vehiculo.create({
        matricula,
        color,
        descripcion,
        nombreModelo,
        idERP,
        MarcaVehiculoId
      });
      return nuevoVehiculo;
    } catch (error) {
      throw error;
    }
  }

  async obtenerVehiculoXidERP(idERP) {
    try {
      
      const vehiculos = await Vehiculo.findAll({
        where : {
          idERP : idERP
        },
        raw : false
      });

      if(vehiculos.length == 0){
        return null;
      }

      return vehiculos[0];

    } catch (error) {
      throw error;
    }
  }


}

module.exports = new VehiculoCtrl();
