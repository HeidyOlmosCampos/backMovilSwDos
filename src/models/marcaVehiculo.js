const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/pgTaller'); 

const MarcaVehiculo = sequelize.define('MarcaVehiculo', {

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    porcentaje: {
        type: DataTypes.DOUBLE,
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

// Método de instancia para modificar la salida JSON
MarcaVehiculo.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    return values;
};

module.exports = MarcaVehiculo;

