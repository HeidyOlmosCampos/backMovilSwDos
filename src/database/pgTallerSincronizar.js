const { sequelize } = require("./pgTaller");
const MarcaVehiculo = require("../models/marcaVehiculo");
const SeguimientoServicio = require("../models/seguimientoServicio");
const servicioChaperia = require("../models/servicioChaperia");
const Vehiculo = require("../models/vehiculo");
const VentaServicio = require("../models/ventaServicio");

const syncModels = async () => {
    try {
        // Sincronizar todos los modelos con la base de datos
        await sequelize.sync({ force: false });
        console.log('Todos los modelos fueron sincronizados correctamente');
    } catch (error) {
        console.error('Error al sincronizar los modelos:', error);
    }
};

module.exports = syncModels;
