const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/pgTaller'); 

const Vehiculo = require("./vehiculo");
const VentaServicio = require("./ventaServicio");
const ServicioChaperio = require('./servicioChaperia');

const SeguimientoServicio = sequelize.define('SeguimientoServicio', {

    fechaInicio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

// Definir relaciones con otras tablas
SeguimientoServicio.belongsTo(Vehiculo); // Define la relación con la tabla Vehiculo
SeguimientoServicio.belongsTo(VentaServicio); // Define la relación con la tabla VentaServicio
SeguimientoServicio.belongsTo(ServicioChaperio); 

// Método de instancia para modificar la salida JSON
SeguimientoServicio.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    return values;
};

module.exports = SeguimientoServicio;

