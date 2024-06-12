const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/pgTaller'); 

const VentaServicio = sequelize.define('VentaServicio', {

    codigoSeguimiento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaVenta: {
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

// Método de instancia para modificar la salida JSON
VentaServicio.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    return values;
};

module.exports = VentaServicio;

