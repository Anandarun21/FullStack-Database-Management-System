const sequelize = require('../util/database');

const NewTable = async (tableName) => {
    const table = sequelize.define(tableName, {});
    await table.sync();
    return table;
}
module.exports = NewTable;