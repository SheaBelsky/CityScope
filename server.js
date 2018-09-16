/*
Purpose: Creates a server for which to run the server.
Author: Zachary Anderson AKA ZachARuba
*/

/*
    INITIALIZATION
*/

require("dotenv").load();
const bodyParser = require("body-parser");
const distance = require("google-distance-matrix");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { SurveyMonkeyAPI } = require("surveymonkey");

distance.units("metric");
distance.key("AIzaSyDG_kiaUVSjUHOrP_UpKWvKiQF1hhA5rIM");

const DISTANCE_THRESHOLD = 50;

const app = express();
const port = process.env.PORT || 3000;

const surveymonkey_key = process.env.SURVEYMONKEY_AUTH;

// Serve React app
const clientDirectory = path.join(__dirname, "client", "dist");
app.use(express.static(clientDirectory));
app.use("/app*", express.static(clientDirectory));

// Body Parser
// Miscellanous settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
const db = new sqlite3.Database("database.db");

// Surveymonkey example
const api = new SurveyMonkeyAPI(surveymonkey_key, { version: "v3", secure: false });

// api.getSurveyList({}, (error, data) => {
//     if (error) { console.log(error.message); } else { console.log(JSON.stringify(data)); } // Do something with your data!
// });
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


// //// Report Database

// CREATE
app.put("/api/create/report/", (req, res, next) => {
    const {
        coordinates,
        description,
        createdAt,
        incidentID,
        sentiment = "",
        updatedAt,
    } = req.body;

    const query = `INSERT INTO report (sentiment, description, incident_id, updated) `
        + `VALUES ('${sentiment}', '${description}', ${incidentID}, ${updatedAt})`;

    // TODO: Create a matching incident if no incidentID is provided by the client
    if (typeof incidentID !== "undefined") {
        // Take the existing route and put part of it into a function.
        // Pass coordinates, createdAt to the incident to be created
    }

    db.run(query, (err) => {
        if (!err) {
            return res.status(200);
        } else {
            return res.status(500).send(err);
        }
    });
});

// READ
app.get("/api/read/report/:report_id/", (req, res, next) => {
    const {
        report_id,
    } = req.params;

    const query = `SELECT * FROM report WHERE report_id = ${report_id}`;

    db.run(query, (err, results) => {
        if (!err) {
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

// DELETE
app.delete("/api/delete/report/:report_id/", (req, res, next) => {
    const {
        report_id,
    } = req.params;

    const query = `DELETE FROM report WHERE report_id = ${report_id}`;

    db.run(query, (err) => {
        if (!err) {
            return res.status(200);
        } else {
            return res.status(500).send(err);
        }
    });
});

// //// Incident Database

// CREATE
app.put("/api/create/incident/", (req, res, next) => {
    // Survey Monkey should not be passed from the frontend, it should be created by a function
    // on the server. That functionality to create a server and bind it to the new incident should
    // take place here.
    const {
        survey_monkey,
        progress,
        coordinates,
        resolution,
        updated,
    } = req.body;

    const query = `INSERT INTO incident (survey_monkey, progress, coordinates, resolution, updated) `
        + `VALUES ('${survey_monkey}', ${progress}, '${coordinates}', '${resolution}', ${updated})`;

    db.run(query, (err) => {
        if (!err) {
            return res.status(200);
        } else {
            return res.status(500).send(err);
        }
    });
});

// READ
app.get("/api/read/incident/:incident_id/", (req, res, next) => {
    const {
        incident_id,
    } = req.params;

    const query = `SELECT * FROM incident WHERE incident_id = ${incident_id}`;

    db.run(query, (err, results) => {
        if (!err) {
            console.log(results);
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

// DELETE
app.delete("/api/delete/incident/:incident_id/", (req, res, next) => {
    const {
        incident_id,
    } = req.params;

    const query = `DELETE FROM incident WHERE incident_id = ${incident_id}`;

    db.run(query, (err) => {
        if (!err) {
            return res.status(200);
        } else {
            return res.status(500).send(err);
        }
    });
});

// GET
app.get("/api/distance/:lat/:lng", (req, res, next) => {
    const {
        lat, lng,
    } = req.params;

    // Form: [`123.123, 123.123`]
    const origins = [`${lat},${lng}`];
    // Append every entry that has a coordinate
    const destinations = [];

    db.all(`SELECT coordinates from incident`, [], (err, rows) => {
        if (err) {
            throw err;
        }

        rows.forEach((row) => {
            destinations.push(row.coordinates);
        });

        distance.matrix(origins, destinations, (err, distances) => {
            if (!err) {
                console.log(distances);

                for (let i = 0; i < distances.rows.length; i++) {
                    // console.log(distance.split(" ")[0]);
                    let distance = distances.rows[i].elements[0].distance.text;
                    console.log(distance);
                    distance = distance.split(" ")[0];

                    if (distance.includes("km")) {
                        distance *= 1000;
                    }

                    if (distance < DISTANCE_THRESHOLD) {
                        return res.json({
                            existingIncident: true,
                        });
                    }
                }
                return res.json({
                    existingIncident: false,
                });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Go to http://localhost:${port}`);
});
