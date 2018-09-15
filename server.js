/*
Purpose: Creates a server for which to run the server.
Author: Zachary Anderson AKA ZachARuba
*/

/*
    INITIALIZATION
*/

//require('dotenv').load();
const express = require("express");
const path = require("path");

/*
    APPLICATION
*/

const app = express();

const port = process.env.PORT || 3000;

// Serve React app
const clientDirectory = path.join(__dirname, "client", "dist");
app.use(express.static(clientDirectory));
app.use("/app*", express.static(clientDirectory));

app.listen(port, function(){
  console.log("Go to http://localhost:" + port);
});
