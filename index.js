// The codes were written by me and some parts are from the previous labs
// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const mustacheExpress = require('mustache-express');

// Initialise objects and declare constants
const app = express();
const webPort = 8088;
// Connect to database: 
const db = mysql.createConnection({
	host: "localhost",
	user: "MARKER",
	password: "DADT1",
	database: "CLINICAL_TRIALS"
});

db.connect((err) => {
	if(err) {
		throw err;
	}
	console.log("Connected to database");
});
// Configure application
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './templates');
app.use(bodyParser.urlencoded({ extended: true }));
// Define template renderer
function templateRenderer(template, response){
	return function(error, results, fields){
		if(error){
			throw error;
		}
		response.render(template, { data: results });
	}
}

app.get('/', function(req, res){
	const data = {};
	// Each line of query below can run when they uncommented one at a time

	// db.query("SELECT COUNT(DISTINCT NCT_NUMBER) AS COMPLETED_STUDIES FROM Study_Description WHERE STUDY_STATUS = 'COMPLETED'", templateRenderer('index', res));
	// db.query("SELECT COUNT(DISTINCT NCT_NUMBER) AS WITHDRAWN_STUDIES FROM Study_Description WHERE STUDY_STATUS = 'WITHDRAWN'", templateRenderer('index', res));
	// db.query("SELECT YEAR(Study_Dates.START_DATE) AS Start_Year, COUNT(*) AS Withdrawn_Trials FROM Study_Description JOIN Study_Dates ON Study_Description.NCT_NUMBER = Study_Dates.NCT_NUMBER WHERE Study_Description.STUDY_STATUS = 'WITHDRAWN' GROUP BY YEAR(Study_Dates.START_DATE) ORDER BY Withdrawn_Trials DESC LIMIT 10", templateRenderer('index', res));
	db.query("SELECT YEAR(Study_Dates.COMPLETION_DATE) AS Start_Year, COUNT(*) AS Completed_Trials FROM Study_Description JOIN Study_Dates ON Study_Description.NCT_NUMBER = Study_Dates.NCT_NUMBER WHERE Study_Description.STUDY_STATUS = 'COMPLETED' GROUP BY YEAR(Study_Dates.COMPLETION_DATE) ORDER BY Completed_Trials DESC LIMIT 10", templateRenderer('index', res));
	// db.query("SELECT SPONSOR, COUNT(*) AS Number_of_Sponsored_Clinical_Trials FROM Study_Contributors GROUP BY SPONSOR ORDER BY Number_of_Sponsored_Clinical_Trials DESC LIMIT 10;", templateRenderer('index', res))
});
app.listen(
  webPort,
  () => console.log('EMO app listening on port '+webPort) // success callback
);
