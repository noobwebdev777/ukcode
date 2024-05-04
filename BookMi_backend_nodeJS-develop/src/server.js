const express = require("express");
const config = require("./config/config");
const dbConnection = require('./db/database');
const authorize = require('./middleware/jwt/verifyToken');
const appRoute = require("./routes/appRoute");
const cors = require("cors");
const morgan = require("morgan");
const agenda = require('./scheduler/scheduler');

const initializeServer = async () => {
  await dbConnection.establishConnection();
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(morgan("dev"));
  app.use(cors());
  app.use(authorize);
  appRoute.initialize(app);
  agenda.on('ready', function () {
    agenda.start();
    console.log('SCHEDULER SERVICE READY')
  });

  app.listen(config.app.port, () =>
    console.log("Book Mi server is running on port:", config.app.port)
  );
};

initializeServer();
