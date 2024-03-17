const sequelize = require('../util/database');
const {DataTypes} = require('sequelize');
const queryInterface = sequelize.getQueryInterface();


exports.addTable = async (req, res, next) => {
    try {
        const { tableName, columnDetails } = req.body;

        // Define the table dynamically
        const tableColumns = {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        };

        for (const columnDetail of columnDetails) {
            const { columnName, dataType } = columnDetail;
            tableColumns[columnName] = {
                type: DataTypes[dataType],
                allowNull: true,
                defaultValue: DataTypes.NOW,
            };
        }

        const table = sequelize.define(tableName, tableColumns);
        await table.sync();
        console.log(req.body);
        res.status(201).json(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server Error' });
    }
};

exports.getAllTables = async (req, res, next) =>  {
    try {
        const tableNames = await queryInterface.showAllTables();
        res.status(200).json({ tableNames });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getTable = async (req, res, next) => {
    try {   
        const tableName = req.params.id;
        const [tableData, metadata] = await sequelize.query(`SELECT * FROM ${tableName}` )
        
        res.status(200).json({tableData, metadata});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.deleteRow = async (req, res, next) => {
    try {
        const {tableName, rowID} = req.params;
        const response = await sequelize.query(`DELETE FROM ${tableName} WHERE id=${rowID}`);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({error: 'Internal server error' });
    }
}

exports.insertData = async (req, res, next) => {
    try {
        const {tableName} = req.params;
        const data = req.body;
        console.log(data);
        const query = `INSERT INTO ${tableName} (id, createdAt, updatedAt, ${Object.keys(data).join(', ')}) VALUES (null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,${Object.values(data).map(value => `'${value}'`).join(', ')});`;
        const response = await sequelize.query(query);
        res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        res.status(500).json({error: 'Internal server error' });
    }
}

exports.getColumns = async (req, res, next) => {
    try {
        const {tableName}= req.params;
        const tableDetails = await queryInterface.describeTable(tableName);
        res.status(200).json({tableDetails});
    } catch (error) {
        res.status(500).json({error: 'Internal server error' });
    }
}
