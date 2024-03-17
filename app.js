const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sequelize = require('./util/database');
const tableRouter =  require('./routes/routes');
const NewTable = require('./models/tableModels');

app.use(cors());
app.use(bodyParser.urlencoded( {extended: true}));
app.use(express.json());
app.use(express.static(path.join (__dirname , 'public')));
app.use("/tableDetails", tableRouter);
  
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

sequelize.sync()
    .then(res => {
        const port = process.env.PORT || 3000;
        app.listen(port , () => console.log(`Server Running on port: ${port}`));
        exports.port = port;
    })
    .catch(err => console.log(err));