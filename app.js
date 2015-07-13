var express 			  = require('express'),
	app     			  = express(),
	bodyParser 			  = require('body-parser'),
	mongoose			  = require('mongoose'),
	websiteListController = require('./server/controllers/websitelist-controller'),
	websiteTableController = require('./server/controllers/websiteTable-controller');

mongoose.connect('mongodb://localhost:27017/web-monitor');

app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.get('/urlAdded', function (req, res) {
	res.sendFile(__dirname + '/client/views/urlAdded.html');
});

app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));

//REST API
app.post('/api/websites', websiteListController.create);
app.get('/api/websites', websiteTableController.list);

app.listen(3000, function(){
	console.log('Listening ...');
});