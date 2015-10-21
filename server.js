// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var fs 			   = require('fs');		
var request 	   = require('request');
var _ 		 	   = require('underscore');

// configuration ===========================================

// config files
var db = require('./config/db');
var apiKey = require('./config/apiKey');

var port = process.env.PORT || 1337; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.get('/mock/api/v1/clean/search.json', function(req, res, next){
	fs.readFile('server/mock-search-api.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}	
	    //res.json(JSON.parse(data));		 	

	    var result = JSON.parse(data);

	    var foo = {
	    				//status: result["SearchResults:searchresults"].message, 
	    				data:  _.first(_.first(_.first(result["SearchResults:searchresults"].response).results ).result)

				   };
		//	console.log(_.first(_.first(_.first(result["SearchResults:searchresults"].response).results ).result );

	    res.json(foo);

	});

});

app.get('/mock/api/v1/xmlparse/search.json', function(req, res, next){
	fs.readFile('server/mock-search-api-xml.xml', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}	
	 
		var xml2js = require('xml2js');
		var parser = new xml2js.Parser({explicitArray : false});
		
	    parser.parseString(data, function(err, result){
	    	var foo = JSON.parse(JSON.stringify(result));
	    	var payload =	{
	    						status: foo["SearchResults:searchresults"].message,
	    						data: foo["SearchResults:searchresults"].response.results.result
	    					};
	    	res.json(payload);
	    });
	});

});

app.get('/mock/api/v1/raw/search.json', function(req, res, next){
	fs.readFile('server/mock-search-api.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}	
	    res.json(JSON.parse(data));		 	
	});

});

app.get('/api/v1/search.json', function(req, res, next){
	var address = req.query.address;
	var citystatezip = req.query.citystatezip;
	
	var url = 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id='+apiKey.keyValue+'&address='+ address +'&citystatezip=' + citystatezip + "&rentzestimate=true";
	console.log("requesting URL: " + url)
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var parseString = require('xml2js').parseString;
	    	parseString(body, function (err, result) {
    			res.json(JSON.parse(JSON.stringify(result)));
			});  	


		}
	})
});

app.get('/test', function(req, res, next){

	
	res.json({foo: "bar"})
});

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app



