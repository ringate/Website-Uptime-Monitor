var express 				= require('express'),
    app 					= express(),
    server 					= require('http').createServer(app),
	io 						= require('socket.io').listen(server),
    bodyParser 				= require('body-parser'),
    mongoose 				= require('mongoose'),
    socketMVC 				= require('socket.mvc'),
    websiteListController   = require('./server/controllers/websitelist-controller'),
    websiteTableController  = require('./server/controllers/websiteTable-controller'),
    websiteGraphController  = require('./server/controllers/websitePingData-controller'),
    config 					= require('./config');

mongoose.connect('mongodb://localhost:27017/web-monitor');
app.use(bodyParser());

//request router
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});
app.get('/listWebsites', function(req, res) {
    res.sendFile(__dirname + '/client/views/urlAdded.html');
});
app.get('/graphs', function(req, res) {
    res.sendFile(__dirname + '/client/views/websiteGraph.html');
});

//to link js and css file in HTML files
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));


//REST API
app.post('/api/websites', websiteListController.create);
app.get('/api/websites', websiteTableController.list);
app.get('/api/website/:name', websiteGraphController.findWebsite);
app.get('/api/getGraphData', websiteGraphController.list);
app.get('/api/getGraphData/:name', websiteGraphController.find);
// checkStatus('http://www.facebook.com/404');
// checkStatus('http://anandhsomu.com');
// checkStatus('http://anandhsomasddadadu.com');

//sendAlertMail();

server.listen(8002, function() {
    console.log('Listening ...');
});

//Set socket.io configuration here 
 //delegating socket.io, so that it can be used in any js file other than app.ja also
io.sockets.on('connection', function (socket) {
 socketMVC.init(io, socket, {
    debug: true,
    filePath: ['./server/routes/socket.js']
  });
});
/*
function sendAlertMail()
{
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: config.gmail.user_name,
	        pass: config.gmail.password
	    }
	});
	
	// setup e-mail data with unicode symbols
	var mailOptions = {
	   from: 'Webmonitor Service <yesiamsham@gmail.com>',
	    to: 'yesyayen@gmail.com',
	    subject: 'hello',
	    text: 'hello world!'
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);

	});
	// create reusable transporter object using SMTP transport
	var transport = nodemailer.createTransport(smtpPool({
	    host: 'smtp.mailgun.org',
	    port: 25,
	    auth: {
	        user: 'postmaster@mg.anandhsomu.com',
	        pass: 'bf5ddf46f0d769bcde44a0ad18ee578d'
	    },
	    // use up to 5 parallel connections
	    maxConnections: 5,
	    // do not send more than 10 messages per connection
	    maxMessages: 10,
	    // no not send more than 5 messages in a second
	    rateLimit: 5
	}));

	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'me@anandhsomu.com', // sender address
	    to: '4125033777@txt.att.net', // list of receivers
	    subject: 'Hello!!', // Subject line
	    text: 'Welcome to New York!' // plaintext body
	};

	// send mail with defined transport object
	transport.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.info('Message sent: ' + info.response);

	});
}*/