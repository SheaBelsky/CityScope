/*
Purpose: Creates a server for which to run the server.
Author: Zachary Anderson AKA ZachARuba
*/

/*
    INITIALIZATION
*/

//require('dotenv').load();
const express = require("express");

/*
    APPLICATION
*/

const app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.send('Hello World!')
})

app.listen(port, function(){
  console.log("Go to http://localhost:" + port);
});
