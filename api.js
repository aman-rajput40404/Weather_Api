var express  = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
require("dotenv").config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bodyParser.json());
var key = "ba970595918df4cef92d546ae46ba0c4";
var city_data = {};


app.get('/', function(req, res) {
	console.log("req quesru",req.query);
	res.render("index", {  city_data: {},temp:null ,error: null });
})

app.post('/', function(req, res) {
	
	var cities = req.body.cities;
	if(typeof(cities)=="string"){
		cities = cities.split(",");
	}

	Object.values(cities).forEach(city => {
		
		var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + key;
		
		request(url, function(err, response, body) {
			
			var weather = JSON.parse(body);
			if (err||weather['cod']!='200') {
				city_data[city] = null;
			} else {
				city_data[city] = weather['main']['temp'];
			}
			
			if(Object.keys(city_data).length == Object.keys(cities).length) {
				console.log("tempreture: ",city_data);
				res.render("index", { city_data: city_data});
			}
		})
	 })
})
	

app.listen(3000, function(){
	console.log("Server started on port: 3000");})
