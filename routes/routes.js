const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.post("/add-table", tableController.addTable); // /tables
router.get("/getTable/:id", tableController.getTable );  // /tables/:id
router.get("/getAllTables", tableController.getAllTables); // /tables
router.delete("/deleteRow/:tableName/:rowID", tableController.deleteRow); // /rows/:id
router.post("/insertData/:tableName", tableController.insertData); // use put instead post /tables/:id
router.get("/getColumns/:tableName", tableController.getColumns);
module.exports = router;