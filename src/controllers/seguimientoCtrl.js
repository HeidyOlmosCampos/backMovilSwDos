
const { TipoServicio, CategoriaServicio } = require("../constant/constantes");
const { analizarImagen } = require("../services/modeloIA");
const ResponseResult = require("../models/responseResult");
const VentaServicio = require("../models/ventaServicio");
const ServicioChaperio = require("../models/servicioChaperia");
const SeguimientoServicio = require("../models/seguimientoServicio");
const MarcaVehiculo = require("../models/marcaVehiculo");
const Vehiculo = require("../models/vehiculo");

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
          codigoSeguimiento: req.params.codigoSeguimiento
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
          VentaServicioId: serviciosChaperio[0].id
        },
        raw: false,
      });

      
      if (seguimientoServicios.length == 0) {
        response.ok = false;
        response.msg = "No existen Servicios asociados a este codigo";
        return res.status(400).send(response.getResponseData());
      }

      response.ok = true;
      response.msg = "Servicios asociados al codigo de seguimiento";
      response.data = seguimientoServicios;
      res.status(200).send(response.getResponseData());

    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al obtener los servicios asociados al codigo de seguimiento";
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
          id: req.params.id
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
          id: seguimientoServicio.VehiculoId
        },
        raw: false
      });
      if (vehiculos.length == 0) {
        response.ok = false;
        response.msg = "No se encuentra el vehiculo asociado";
        return res.status(400).send(response.getResponseData());
      }
      const vehiculo = vehiculos[0];


      const marcasVehiculo = await MarcaVehiculo.findAll({
        where: {
          id: vehiculo.MarcaVehiculoId
        },
        raw: false
      });
      if (marcasVehiculo.length == 0) {
        response.ok = false;
        response.msg = "No existe la marca asociada al detalle";
        return res.status(400).send(response.getResponseData());
      }
      const marcaVehiculo = marcasVehiculo[0];


      const serviciosTaller = await ServicioChaperio.findAll({
        where: {
          id: seguimientoServicio.ServicioChaperioId
        },
        raw: false
      });
      if (serviciosTaller.length == 0) {
        response.ok = false;
        response.msg = "No se encuentra la venta asociada";
        return res.status(400).send(response.getResponseData());
      }
      const servicioTaller = serviciosTaller[0];
      

      const ventaServicios = await VentaServicio.findAll({
        where: {
          id: seguimientoServicio.VentaServicioId
        },
        raw: false
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

        nombreServicio: servicioTaller.nombre,
        descripcionServicio: servicioTaller.descripcion,

        fechaIniSeguimiento: seguimientoServicio.fechaInicio,
        fechaFinSeguimiento: seguimientoServicio.fechaFin,
        estadoSeguimiento: seguimientoServicio.estado,
        descripcionSeguimiento: seguimientoServicio.observacion,
      }

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

  async _calcularPrecioEnBaseaEtiquetayMarca(etiqueta, idMarca) {
    try {
      let precioEstimado = 0;
      let nombreServicio = CategoriaServicio.DESCONOCIDA;
      let descripcionServicio = CategoriaServicio.DESCONOCIDA;
      if(etiqueta !== CategoriaServicio.DESCONOCIDA){
        const serviciosChaperio = await ServicioChaperio.findAll({
          where: {
            iaLabel: etiqueta,
            tipo: TipoServicio.CHAPERIO
          },
          raw: false,
        });

        const marcasVehiculo = await MarcaVehiculo.findAll({
          where: {
            id: idMarca
          },
          raw: false,
        });
  
        let tarifaBaseServicio = 0;
        let incrementoServicio = 0;
        if(serviciosChaperio.length > 0){
          const primerServicio = serviciosChaperio[0];
          tarifaBaseServicio = primerServicio.tarifaBase; 
          nombreServicio = primerServicio.nombre
          descripcionServicio = primerServicio.descripcion;
        }

        if(marcasVehiculo.length > 0){
          const primerMarca = marcasVehiculo[0];
          incrementoServicio = primerMarca.porcentaje;
        }
        
        precioEstimado = tarifaBaseServicio + tarifaBaseServicio * (incrementoServicio / 100);
      }

      return {
        nombreServicio,
        descripcionServicio,
        precioEstimado
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SeguimientoCtrl();
