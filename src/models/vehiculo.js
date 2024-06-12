const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/pgTaller'); 
const MarcaVehiculo = require('./marcaVehiculo');

const Vehiculo = sequelize.define('Vehiculo', {

    matricula: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombreModelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idERP: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

Vehiculo.belongsTo(MarcaVehiculo); // Define la relación con la tabla Vehiculo

// Método de instancia para modificar la salida JSON
Vehiculo.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    return values;
};

module.exports = Vehiculo;

