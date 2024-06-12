
const { TipoServicio, CategoriaServicio } = require("../constant/constantes");
const { analizarImagen } = require("../services/modeloIA");
const ResponseResult = require("../models/responseResult");
const ServicioChaperio = require("../models/servicioChaperia");
const MarcaVehiculo = require("../models/marcaVehiculo");
const { ExceptionMessages } = require("@google-cloud/storage/build/src/storage");

class PreInspeccionCtrl {
  constructor() {}

  async calcularPrecio(req, res) {
    var response = new ResponseResult();
    try {
      if (!req.file) {
        response.ok = false;
        response.msg = "No se recibió la imagen";
        return res.status(400).send(response.getResponseData());
      }

      if (!req.body.idMarcaVehiculo) {
        response.ok = false;
        response.msg = "No se recibió la marca";
        return res.status(400).send(response.getResponseData());
      }

      const idMarcaVehiculo = req.body.idMarcaVehiculo;
      const resultado = await analizarImagen(req.file.buffer);

      let etiqueta = resultado.label;
      let coincidencia = resultado.confidence;

      console.log(etiqueta + ' => ' + coincidencia)

      if(coincidencia < 0.8){
        etiqueta = CategoriaServicio.DESCONOCIDA;
      }

      const datosPreinspeccion = await this._calcularPrecioEnBaseaEtiquetayMarca(
        etiqueta,
        idMarcaVehiculo
      );

      response.ok = true;
      response.msg = "Calculo realizado exitosamente";
      response.data = datosPreinspeccion;

      res.status(200).send(response.getResponseData());
    } catch (error) {
      console.log(error);
      response.ok = false;
      response.msg = "Error al calcular el precio";
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

module.exports = new PreInspeccionCtrl();
