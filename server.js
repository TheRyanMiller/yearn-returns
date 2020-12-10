const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require("path");
const BalanceRouter = require('./server/balance/routes.balance');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const API_PORT = process.env.API_PORT;
const app = express();
const router = express.Router();

// USE middleware are executed every time a request is receieved
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(cors());
app.use('/api', router);
BalanceRouter.routesConfig(router);

// launch our backend into a port
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

//PROD
if(process.env.PROD==="true"){
  console.log("Environment: Prod")
  https.createServer({
    key: fs.readFileSync(process.env.CERT_KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH)
  }, app).listen(process.env.PORT || process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.PORT || process.env.API_PORT}`));
}

//NOT PROD
if(process.env.PROD==="false"){
  console.log("Environment: Non-prod")
  app.listen(process.env.PORT || process.env.API_PORT, () => console.log(`LISTENING ON PORT ${process.env.PORT || process.env.API_PORT}`));
}