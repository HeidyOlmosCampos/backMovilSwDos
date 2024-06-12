const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/pgTaller'); 

const ServicioChaperio = sequelize.define('ServicioChaperio', {

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    iaLabel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tarifaBase: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    tipo: {
        type: DataTypes.INTEGER,
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
ServicioChaperio.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    return values;
};

module.exports = ServicioChaperio;

