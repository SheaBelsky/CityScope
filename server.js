/*
Purpose: Creates a server for which to run the server.
Author: Zachary Anderson AKA ZachARuba
*/

/*
    INITIALIZATION
*/

require('dotenv').load();
const express = require("express");
const path = require("path");
var SurveyMonkeyAPI = require('surveymonkey').SurveyMonkeyAPI;
var distance = require('google-distance-matrix');
distance.units('metric');
distance.key('AIzaSyDG_kiaUVSjUHOrP_UpKWvKiQF1hhA5rIM');

var DISTANCE_THRESHOLD = 50;

/*
    APPLICATION
*/

const app = express();
const port = process.env.PORT || 3000;

const surveymonkey_key = process.env.SURVEYMONKEY_AUTH;
console.log(surveymonkey_key);
const google_key = process.env.GOOGLE_AUTH;

// Serve React app
const clientDirectory = path.join(__dirname, "client", "dist");
app.use(express.static(clientDirectory));
app.use("/app*", express.static(clientDirectory));

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

//Surveymonkey example
try {
    var api = new SurveyMonkeyAPI(surveymonkey_key, {version: 'v3', secure: false});
} catch (error) {
    console.log(error.message);
}

// api.getSurveyList({}, function (error, data) {
//     if (error)
//         console.log(error.message);
//     else
//         console.log(JSON.stringify(data)); // Do something with your data!
// });

/*
api.getSurveyDetails({id:'113260729'},function (error, data) {
    if (error)
        console.log(error);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
*/

////// Report Database

// CREATE
app.put('/api/create/:report_id/:sentiment/:description/:incident_id/:updated', function (req, res, next) {
    var report_id = req.params.report_id;
    var sentiment = req.params.sentiment;
    var description = req.params.description;
    var incident_id = req.params.incident_id;
    var updated = req.params.updated;

    const query = `INSERT INTO report (report_id, sentiment, description, incident_id, updated) ` +
        `VALUES (${report_id}, '${sentiment}', '${description}', ${incident_id}, ${updated})`;

    db.run(query);

    res.status(200);
});

// READ
app.get('/api/read/:report_id/:sentiment/:description/:incident_id/:updated', function (req, res, next) {
    var report_id = req.params.report_id;
    var sentiment = req.params.sentiment;
    var description = req.params.description;
    var incident_id = req.params.incident_id;
    var updated = req.params.updated;

    const query = `INSERT INTO report (report_id, sentiment, description, incident_id, updated) ` +
        `VALUES (${report_id}, '${sentiment}', '${description}', ${incident_id}, ${updated})`;

    db.run(query);

    res.status(200);
});

// DELETE
app.get('/api/delete/:report_id/:sentiment/:description/:incident_id/:updated', function (req, res, next) {
    var report_id = req.params.report_id;
    var sentiment = req.params.sentiment;
    var description = req.params.description;
    var incident_id = req.params.incident_id;
    var updated = req.params.updated;

    const query = `INSERT INTO report WHERE report_id = ${report_id}, sentiment = '${sentiment}', ` +
        `description = '${description}', incident_id = ${incident_id}, updated) = ${updated})`;

    db.run(query);

    res.status(200);
});

////// Incident Database

// READ
app.get('/api/read/incident', function (req, res, next) {
    // const query = `SELECT * FROM incident`;
    // res.json(db.all(query));
});

// CREATE
app.put('/api/create/:incident_id/:survey_monkey/:progress/:coordinates/:resolution/:updated', function (req, res, next) {
    var incident_id = req.params.incident_id;
    var survey_monkey = req.params.survey_monkey;
    var progress = req.params.progress;
    var coordinates = req.params.coordinates;
    var resolution = req.params.resolution;
    var updated = req.params.updated;

    const query = `INSERT INTO incident (incident_id, survey_monkey, progress, coordinates, resolution, updated) ` +
        `VALUES (${incident_id}, '${survey_monkey}', ${progress}, '${coordinates}', '${resolution}', ${updated})`;

    db.run(query);

    res.status(200);
});


app.get('/api/distance/:lat/:long', function (req, res, next) {

    var lat = req.params.lat;
    var long = req.params.long;

    // Form: [`123.123, 123.123`]
    var origins = [`${lat},${long}`];
    // Append every entry that has a coordinate
    var destinations = [];

    db.all(`SELECT coordinates from incident`, [], (err, rows) => {
        if (err) {
            throw err;
        }

        rows.forEach((row) => {
            destinations.push(row.coordinates);
        });

        distance.matrix(origins, destinations, function (err, distances) {
            if (!err) {

                console.log(distances);

                for (var i = 0; i < distances.rows.length; i++) {
                    // console.log(distance.split(" ")[0]);
                    var distance = distances.rows[i].elements[0].distance.text;
                    console.log(distance);

                    if (distance.includes('km')) {
                        distance = distance.split(" ")[0] * 1000;
                    } else {
                        distance = distance.split(" ")[0];
                    }

                    // Only consider distances in meters
                    if (distance > DISTANCE_THRESHOLD) {
                        res.json('false')
                        return;
                    }
                }

                res.json('true')
            }
        })
    });
});

app.listen(port, function () {
    console.log("Go to http://localhost:" + port);
});
