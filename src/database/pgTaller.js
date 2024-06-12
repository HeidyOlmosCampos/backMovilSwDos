const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_PGSQL, {
    dialect: 'postgres',
    logging: false
});

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion correcta la base de datos');

    } catch (error) {
        console.log('No se puede conectar a la base de datos:', error);
        throw new Error('Error en la Base de datos');
    }
}

module.exports = { dbConnection, sequelize }
