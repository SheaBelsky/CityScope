/*
Purpose: Creates a server for which to run the server.
Author: Zachary Anderson AKA ZachARuba
*/

/*
    INITIALIZATION
*/

require("dotenv").load();
const express = require("express");
const path = require("path");
const SurveyMonkeyAPI = require("surveymonkey").SurveyMonkeyAPI;

/*
    APPLICATION
*/

const app = express();
const port = process.env.PORT || 3000;

const surveymonkey_key = process.env.SURVEYMONKEY_AUTH;

// Serve React app
const clientDirectory = path.join(__dirname, "client", "dist");
app.use(express.static(clientDirectory));
app.use("/app*", express.static(clientDirectory));

// Surveymonkey example
try {
    var api = new SurveyMonkeyAPI(surveymonkey_key, { version: "v3", secure: false });
} catch (error) {
    console.log(error.message);
}

api.getSurveyList({}, (error, data) => {
    if (error) { console.log(error.message); } else { console.log(JSON.stringify(data)); } // Do something with your data!
});

/*
api.getSurveyDetails({id:'113260729'},function (error, data) {
    if (error)
        console.log(error);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
*/

app.listen(port, () => {
    console.log(`Go to http://localhost:${port}`);
});
