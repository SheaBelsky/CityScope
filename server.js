/*
Purpose: Creates a server for which to run the server.
Author: Zachary Anderson AKA ZachARuba
*/

/*
    INITIALIZATION
*/

require("dotenv").load();
const async = require("async");
const bodyParser = require("body-parser");
const https = require("https");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { SurveyMonkeyAPI } = require("surveymonkey");

const app = express();
const port = process.env.PORT || 3000;

const DISTANCE_THRESHOLD = 50;
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

// //// Report Database

// CREATE a report
app.put("/api/create/report/", (req, res, next) => {
    const {
        coordinates,
        description,
        createdAt,
        incidentID,
        sentiment = "",
        updatedAt,
    } = req.body;

    async.waterfall([
        (waterfallCB) => {
            // Create a new incident if necessary
            if (typeof incidentID === "undefined") {
                // Take the existing route and put part of it into a function.
                // Pass coordinates, createdAt to the incident to be created
                createNewIncident({ coordinates, updatedAt }, waterfallCB);
            } else {
                return waterfallCB(null, incidentID);
            }
        },
        (newIncidentID, waterfallCB) => {
            const query = `INSERT INTO report (sentiment, description, incident_id, updated, coordinates)
            VALUES ('${sentiment}', '${description}', ${newIncidentID}, ${updatedAt}, '${coordinates}')`;
            db.run(query, waterfallCB);
        },
    ], (err) => {
        if (!err) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).send(err);
        }
    });
});

// READ a report given its id
app.get("/api/read/report/:report_id/", (req, res, next) => {
    const {
        report_id,
    } = req.params;

    const query = `SELECT * FROM report WHERE report_id = ${report_id}`;

    db.all(query, [], (err, results) => {
        if (!err) {
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

// READ all reports
app.get("/api/read/report/", (req, res) => {
    // limit???
    const query = `SELECT * FROM report`;

    db.all(query, [], (err, results) => {
        if (!err) {
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

// DELETE a report given its id
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

// Create a new SurveyMonkey survey
function createNewSurvey(cb) {
    const testData = {
        title: "New Survey",
        from_survey_id: "158112240",
    };

    let buffer = "";

    const options = {
        hostname: "api.surveymonkey.com",
        path: "/v3/surveys",
        method: "POST",
        headers: {
            "Content-Type": "application/JSON",
            Authorization: `bearer ${surveymonkey_key}`,
        },
    };

    const req = https.request(options, (res) => {
        res.on("data", (d) => {
            buffer += d;
        });
        res.on("end", () => cb(null, buffer)).on("error", err => cb(err));
    });
    req.write(JSON.stringify(testData));
    req.end();
}

// Create a new incident
function createNewIncident(data, cb) {
    createNewSurvey((err, surveyVal) => {
        if (!err) {
            const parsedSurveyVal = JSON.parse(surveyVal);
            const { id: surveyId } = parsedSurveyVal;
            const {
                progress = "No progress",
                coordinates,
                resolution = "No resolution",
                updatedAt,
            } = data;

            const query = `INSERT INTO incident (survey_monkey, progress, coordinates, resolution, updated) `
            + `VALUES ('${surveyId}', '${progress}', '${coordinates}', '${resolution}', '${updatedAt}')`;

            db.run(query, (err, results) => cb(err, results));
        } else {
            return cb(err);
        }
    });
}

// // CREATE a new incident
// app.put("/api/create/incident/", (req, res, next) => {
//     createNewIncident(req.body, (err, results) => {
//         if (!err) {
//             return res.status(200);
//         } else {
//             return res.status(500).send(err);
//         }
//     });
// });

// READ all reports
app.get("/api/read/incident/", (req, res) => {
    // limit???
    const query = `SELECT * FROM incident`;

    db.all(query, [], (err, results) => {
        if (!err) {
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

// READ an incident, given its id
app.get("/api/read/incident/:incident_id/", (req, res, next) => {
    const {
        incident_id,
    } = req.params;

    const query = `SELECT * FROM incident WHERE incident_id = ${incident_id}`;

    db.all(query, [], (err, results) => {
        if (!err) {
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

// DELETE an incident, given its id
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

// Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

// GET
app.get("/api/distance/:lat/:lng", (req, res) => {
    const {
        lat: lat1,
        lng: lng1,
    } = req.params;

    db.all(`SELECT * from incident`, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            let existingIncidentID;
            const existingIncident = rows.some((curRow) => {
                const [lat2, lng2] = curRow.coordinates.split(",");
                const distanceValue = getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
                if (distanceValue < DISTANCE_THRESHOLD) {
                    existingIncidentID = curRow.incident_id;
                    return true;
                } else {
                    return false;
                }
            });
            return res.status(200).json({
                existingIncident,
                existingIncidentID,
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Go to http://localhost:${port}`);
});
