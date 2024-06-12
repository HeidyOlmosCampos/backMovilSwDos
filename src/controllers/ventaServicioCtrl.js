
const { TipoServicio, CategoriaServicio } = require("../constant/constantes");
const ResponseResult = require("../models/responseResult");
const Vehiculo = require("../models/vehiculo");
const VentaServicio = require("../models/ventaServicio");
const SeguimientoServicio = require("../models/seguimientoServicio");
const MarcaVehiculoCtrl = require('./marcaVehiculoCtrl');
const ServicioChaperiaCtrl = require("./servicioChaperiaCtrl");
const VehiculoCtrl = require('./vehiculoCtrl');

class VentaServicioCtrl {
  constructor() {}


  async insertarVenta(req, res) {
    var response = new ResponseResult();
    try {

      if (!req.body) {
        response.ok = false;
        response.msg = "No se recibieron los parametros";
        return res.status(400).send(response.getResponseData());
      }

      const cabeceraVenta = req.body.cabecera;
      const detalleVenta = req.body.detalle;
  
      let detalleVentaArray = []; //Seguimiento servicio
  
      const promises = detalleVenta.map(async (unDetalle) => {

        let fechaInicio = unDetalle.fechaInicio;
        let fechaFin = unDetalle.fechaFin;
        let estado = unDetalle.estado;
        let observacion = unDetalle.observacion;
        let VehiculoId = unDetalle.VehiculoId; //este es del erp
        let VentaServicioId = unDetalle.VentaServicioId; //este del erp
        let ServicioChaperioId = unDetalle.ServicioChaperioId; //este es del erp

        let vehiculo = await VehiculoCtrl.obtenerVehiculoXidERP(VehiculoId);
        if(!vehiculo){
          response.ok = false;
          response.msg = "Id de vehiculo incorrecta: " + MarcaVehiculoId;
          return res.status(400).send(response.getResponseData());
        }
        VehiculoId = vehiculo.id;

        let servicio = await ServicioChaperiaCtrl.obtenerServicioXidERP(ServicioChaperioId);
        if(!servicio){
          response.ok = false;
          response.msg = "Id de vehiculo incorrecta: " + ServicioChaperioId;
          return res.status(400).send(response.getResponseData());
        }
        ServicioChaperioId = servicio.id;

        let detalleData = {
          fechaInicio : fechaInicio,
          fechaFin : fechaFin,
          estado : estado,
          observacion : observacion,
          VehiculoId : VehiculoId, 
          VentaServicioId : VentaServicioId, //este del erp
          ServicioChaperioId : ServicioChaperioId 
        };

        detalleVentaArray.push(detalleData);
      });

      await Promise.all(promises);


      const codigoSeguimiento = cabeceraVenta.codigoSeguimiento;
      const fechaVenta = cabeceraVenta.fechaVenta;
      const idERP = cabeceraVenta.idERP;
      const cabeceraNueva = await this.insertarVentaServicioBD(codigoSeguimiento, fechaVenta, idERP);

      const promisesInsertarDetalle = detalleVentaArray.map((unDetalle) =>{
        let fechaInicio = unDetalle.fechaInicio;
        let fechaFin = unDetalle.fechaFin;
        let estado = unDetalle.estado;
        let observacion = unDetalle.observacion;
        let VehiculoId = unDetalle.VehiculoId; //este es del erp
        let VentaServicioId = cabeceraNueva.id; //este del erp
        let ServicioChaperioId = unDetalle.ServicioChaperioId; //este es del erp

        this.insertarDetalleVentaServicioBD(fechaInicio, fechaFin, estado, observacion, VehiculoId, VentaServicioId, ServicioChaperioId);
      });
      await Promise.all(promisesInsertarDetalle);

      response.ok = true;
      response.msg = "Venta insertada";
      response.data = cabeceraNueva;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al insertar Vehiculo";
      res.status(500).send(response.getResponseData());
    }
  }


  //cabecera de la venta
  async insertarVentaServicioBD(codigoSeguimiento, fechaVenta, idERP) {
    try {
      const nuevaVenta = await VentaServicio.create({ codigoSeguimiento, fechaVenta, idERP });
      return nuevaVenta;
    } catch (error) {
      throw error;
    }
  }

  //detalle de la venta
  async insertarDetalleVentaServicioBD(fechaInicio, fechaFin, estado, observacion, VehiculoId, VentaServicioId, ServicioChaperioId) {
    try {
      const nuevaDetalle = await SeguimientoServicio.create({fechaInicio, fechaFin, estado, observacion, VehiculoId, VentaServicioId, ServicioChaperioId});
      return nuevaDetalle;
    } catch (error) {
      throw error;
    }
  }

  


}

module.exports = new VentaServicioCtrl();
