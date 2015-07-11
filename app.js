var express 			  = require('express'),
	app     			  = express(),
	bodyParser 			  = require('body-parser'),
	mongoose			  = require('mongoose'),
	websiteListController = require('./server/controllers/websitelist-controller');

mongoose.connect('mongodb://localhost:27017/web-monitor');

app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));

//REST API
app.get('/api/websites', websiteListController.list);
app.post('/api/websites', websiteListController.create);

app.listen(3000, function(){
	console.log('Listening ...');
});