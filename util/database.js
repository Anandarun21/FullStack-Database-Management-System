const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(
    'database_management_project',
    'root',
    'Arunvenkat@74',
    {
        host:'localhost',
        dialect:'mysql',
    }
);

module.exports = sequelize;