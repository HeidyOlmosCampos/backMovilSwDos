const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require('morgan'); //Middleware de registro de solicitudes HTTP para node.js
const bodyparser = require("body-parser");
require("dotenv").config();

const { dbConnection } = require("./src/database/pgTaller");
const syncModels = require("./src/database/pgTallerSincronizar");


const app = express();
const server = http.createServer(app);

// settings
app.set("port", process.env.PORT || 5000);
var corsOpt = {
  origin: "*",
};
app.use(cors(corsOpt));
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({ limit: "15mb", extended: true }));
app.use(bodyparser.json({ limit: "15mb" }));

// routes
// app.use("/api", require("./src/routes/prueba"));
app.use("/api", require("./src/routes/preInspeccionRuta"));

// Start Server
const startServer = async () => {
  try {
    await dbConnection();
    await syncModels();
    server.listen(app.get("port"), () => {
      console.log("Taller mecanico servicio en el puerto ", app.get("port"));
    });

  } catch (error) {
    console.error("Error al levantar el servidor:", error);
  }
};

startServer();



