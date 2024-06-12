const { TipoServicio, CategoriaServicio } = require("../constant/constantes");
const { analizarImagen } = require("../services/modeloIA");
const ResponseResult = require("../models/responseResult");
const VentaServicio = require("../models/ventaServicio");
const ServicioChaperio = require("../models/servicioChaperia");
const SeguimientoServicio = require("../models/seguimientoServicio");
const MarcaVehiculo = require("../models/marcaVehiculo");
const Vehiculo = require("../models/vehiculo");
const VehiculoCtrl = require('./vehiculoCtrl');
const VentaServicioCtrl = require('./ventaServicioCtrl');
const ServicioChaperiaCtrl = require('./servicioChaperiaCtrl');

class SeguimientoCtrl {
  constructor() {}

  //obtiene todos los servicios asociados a una venta por el codigo de seguimiento del servicio
  async obtenerPorCodigoDeSeguimiento(req, res) {
    var response = new ResponseResult();
    try {
      if (!req.params.codigoSeguimiento) {
        response.ok = false;
        response.msg = "No se recibió el codigo de seguimiento";
        return res.status(400).send(response.getResponseData());
      }

      const serviciosChaperio = await VentaServicio.findAll({
        where: {
          codigoSeguimiento: req.params.codigoSeguimiento,
        },
        raw: false,
      });

      if (serviciosChaperio.length == 0) {
        response.ok = false;
        response.msg = "Codigo de seguimiento incorrecto";
        return res.status(400).send(response.getResponseData());
      }

      const seguimientoServicios = await SeguimientoServicio.findAll({
        where: {
          VentaServicioId: serviciosChaperio[0].id,
        },
        raw: false,
      });
      

      let seguimientoServiciosArray = [];

      const promises = seguimientoServicios.map(async (servicio) => {
        const vehiculos = await Vehiculo.findAll({
          where: {
            id: servicio.VehiculoId,
          },
          raw: false,
        });
        if (vehiculos.length == 0) {
          response.ok = false;
          response.msg = "No se encuentra el vehiculo asociado";
          return res.status(400).send(response.getResponseData());
        }

        const serviciosTaller = await ServicioChaperio.findAll({
          where: {
            id: servicio.ServicioChaperioId,
          },
          raw: false,
        });
        if (serviciosTaller.length == 0) {
          response.ok = false;
          response.msg = "No se encuentra la venta asociada";
          return res.status(400).send(response.getResponseData());
        }

        let servicioData = {
          idServicio: servicio.id,
          fechaInicioServicio: servicio.fechaInicio,
          fechaFinServicio: servicio.fechaFin,
          estadoServicio: servicio.estado,
          nombreServicio: serviciosTaller[0].nombre,
          matriculaVehiculo: vehiculos[0].matricula,
        };

        seguimientoServiciosArray.push(servicioData);
      });

      await Promise.all(promises);

      response.ok = true;
      response.msg = "Servicios asociados al codigo de seguimiento";
      response.data = seguimientoServiciosArray;
      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg =
        "Error al obtener los servicios asociados al codigo de seguimiento";
      res.status(500).send(response.getResponseData());
    }
  }

  async obtenerDetalleSeguimiento(req, res) {
    var response = new ResponseResult();
    try {
      if (!req.params.id) {
        response.ok = false;
        response.msg = "No se recibió el id para el seguimiento";
        return res.status(400).send(response.getResponseData());
      }

      const seguimientoServicios = await SeguimientoServicio.findAll({
        where: {
          id: req.params.id,
        },
        raw: false,
      });
      if (seguimientoServicios.length == 0) {
        response.ok = false;
        response.msg = "No existe detalle del servicio";
        return res.status(400).send(response.getResponseData());
      }
      const seguimientoServicio = seguimientoServicios[0];

      const vehiculos = await Vehiculo.findAll({
        where: {
          id: seguimientoServicio.VehiculoId,
        },
        raw: false,
      });
      if (vehiculos.length == 0) {
        response.ok = false;
        response.msg = "No se encuentra el vehiculo asociado";
        return res.status(400).send(response.getResponseData());
      }
      const vehiculo = vehiculos[0];

      const marcasVehiculo = await MarcaVehiculo.findAll({
        where: {
          id: vehiculo.MarcaVehiculoId,
        },
        raw: false,
      });
      if (marcasVehiculo.length == 0) {
        response.ok = false;
        response.msg = "No existe la marca asociada al detalle";
        return res.status(400).send(response.getResponseData());
      }
      const marcaVehiculo = marcasVehiculo[0];

      const serviciosTaller = await ServicioChaperio.findAll({
        where: {
          id: seguimientoServicio.ServicioChaperioId,
        },
        raw: false,
      });
      if (serviciosTaller.length == 0) {
        response.ok = false;
        response.msg = "No se encuentra la venta asociada";
        return res.status(400).send(response.getResponseData());
      }
      const servicioTaller = serviciosTaller[0];

      const ventaServicios = await VentaServicio.findAll({
        where: {
          id: seguimientoServicio.VentaServicioId,
        },
        raw: false,
      });
      if (ventaServicios.length == 0) {
        response.ok = false;
        response.msg = "No se encuentra la venta asociada";
        return res.status(400).send(response.getResponseData());
      }
      const venta = ventaServicios[0];

      const detalleServicio = {
        idVenta: venta.id,
        fechaVenta: venta.fechaVenta,
        codigoSeguimiento: venta.codigoSeguimiento,

        matriculaVehiculo: vehiculo.matricula,
        colorVehiculo: vehiculo.color,
        modeloVehiculo: vehiculo.nombreModelo,
        descripcionVehiculo: vehiculo.descripcion,
        marcaVehiculo: marcaVehiculo.nombre,

        nombreServicio: servicioTaller.nombre,
        descripcionServicio: servicioTaller.descripcion,

        fechaIniSeguimiento: seguimientoServicio.fechaInicio,
        fechaFinSeguimiento: seguimientoServicio.fechaFin,
        estadoSeguimiento: seguimientoServicio.estado,
        descripcionSeguimiento: seguimientoServicio.observacion,
      };

      response.ok = true;
      response.msg = "Detalle del servicio recuperado exitosamente";
      response.data = detalleServicio;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al obtener marcas de vehiculo";
      res.status(500).send(response.getResponseData());
    }
  }

  async actualizarSeguimiento(req, res){
    var response = new ResponseResult();
    try {

      if (!req.body) {
        response.ok = false;
        response.msg = "No se recibieron los parametros";
        return res.status(400).send(response.getResponseData());
      }

      let fechaInicio = req.body.fechaInicio;
      let fechaFin = req.body.fechaFin;
      let estado = req.body.estado;
      let observacion = req.body.observacion;
      let VehiculoId = req.body.VehiculoId; //este es del erp
      let VentaServicioId = req.body.VentaServicioId; //este del erp
      let ServicioChaperioId = req.body.ServicioChaperioId; //este es del erp

      const vehiculo = await VehiculoCtrl.obtenerVehiculoXidERP(VehiculoId);
      const venta = await VentaServicioCtrl.obtenerVentaXidERP(VentaServicioId);
      const servicioChap = await ServicioChaperiaCtrl.obtenerServicioXidERP(ServicioChaperioId);


      if(!vehiculo){
        response.ok = false;
        response.msg = "No existe el vehiculo";
        return res.status(400).send(response.getResponseData());
      }
      if(!venta){
        response.ok = false;
        response.msg = "No existe la venta";
        return res.status(400).send(response.getResponseData());
      }
      if(!servicioChap){
        response.ok = false;
        response.msg = "No existe el servicio";
        return res.status(400).send(response.getResponseData());
      }

      VehiculoId = vehiculo.id; //este es del erp
      VentaServicioId = venta.id; //este del erp
      ServicioChaperioId = servicioChap.id; //este es del erp

      let seguimiento = await this.obtenerSeguimientoServicio(VehiculoId, VentaServicioId, ServicioChaperioId);
      if(!seguimiento){
        response.ok = false;
        response.msg = "No existe el detalle";
        return res.status(400).send(response.getResponseData());
      }

      let seguimientoActualizar = {
        fechaInicio,
        fechaFin,
        estado,
        observacion,
        VehiculoId,
        VentaServicioId,
        ServicioChaperioId,
      }

      let seguimientoActualizado = await this.actualizarSeguimientoServicioBD(seguimiento.id, seguimientoActualizar);

      response.ok = true;
      response.msg = "Seguimiento Actualizado";
      response.data = seguimientoActualizado;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al insertar Vehiculo";
      res.status(500).send(response.getResponseData());
    }
  }

  async obtenerSeguimientoServicio(VehiculoId, VentaServicioId, ServicioChaperioId) {
    try {
      const seguimientosServicio = await SeguimientoServicio.findAll({
        where : {
          VehiculoId : VehiculoId,
          VentaServicioId : VentaServicioId,
          ServicioChaperioId : ServicioChaperioId
        },
        raw : false
      });

      if(seguimientosServicio.length == 0){
        return null;
      }

      return seguimientosServicio[0];
    } catch (error) {
      throw error;
    }
  }

  async actualizarSeguimientoServicioBD(id, nuevosDatos) {
    try {
      const [numRowsUpdated, [updatedSeguimiento]] = await SeguimientoServicio.update(nuevosDatos, {
        where: { id: id },
        returning: true // Esto es útil para obtener el registro actualizado en PostgreSQL
      });
  
      if (numRowsUpdated === 0) {
        return null;
      }
  
      return updatedSeguimiento;
    } catch (error) {
      console.error('Error al actualizar Venta Servicio:', error);
      throw error;
    }
  }
  

}

module.exports = new SeguimientoCtrl();
