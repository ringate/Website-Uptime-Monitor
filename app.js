var express 			= require('express'),
    app 				= express(),
    server 				= require('http').createServer(app),
	io 					= require('socket.io').listen(server),
    bodyParser 			= require('body-parser'),
    mongoose 			= require('mongoose'),
    Curl 				= require('node-libcurl').Curl,
    nodemailer 			= require('nodemailer'),
    smtpPool 			= require('nodemailer-smtp-pool'),
    websiteListController = require('./server/controllers/websitelist-controller'),
    websiteTableController = require('./server/controllers/websiteTable-controller');

mongoose.connect('mongodb://localhost:27017/web-monitor');
app.use(bodyParser());

//request router
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});
app.get('/urlAdded', function(req, res) {
    res.sendFile(__dirname + '/client/views/urlAdded.html');
});


//to link js and css file in HTML files
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));


//REST API
app.post('/api/websites', websiteListController.create);
app.get('/api/websites', websiteTableController.list);


//socket.io incommming and outgoing socket requests
var sockets = [];		//array to store the socket ID of all the clients that are connected with this server

io.sockets.on('connection', function(socket) {

	sockets.push(socket);		//appending the socket ID of the client to the array

	socket.on('createNote', function(data) {
		//socket.broadcast.emit('onNoteCreated', data);
		console.log(data);
	});

	if(sockets.length > 2)
	{
		checkStatus('http://www.google.com/404');
	}
});

// checkStatus('http://www.facebook.com/404');
// checkStatus('http://anandhsomu.com');
// checkStatus('http://anandhsomasddadadu.com');

//sendAlertMail();

server.listen(3000, function() {
    console.log('Listening ...');
});


function checkStatus(url)
{
	var curl = new Curl();
	curl.setOpt('URL', url);
	curl.setOpt( Curl.option.TIMEOUT, 30 );
	curl.setOpt('FOLLOWLOCATION', true);

	curl.on('end', function(statusCode, body, headers) {

		console.info( 'URL', url);
	    console.info( 'Status Code: ', statusCode );
	    io.sockets.emit('onNoteCreated', statusCode);
	    console.info( 'TOTAL_TIME: ', this.getInfo('TOTAL_TIME') );
	    console.info( 'Body length: ', body.length );

	    this.close();
	});
	//curl.on( 'error', curl.close.bind( curl ) );
	curl.on('error', cb);
	curl.perform();
}

function cb(statusOrError) 
{

    var siteName = this.getInfo(Curl.info.PRIVATE);
    if(siteName == undefined)
	{

	}

    this.close();

    if (typeof statusOrError !== "number") { //we have an error
        console.error(siteName, ' - Error: ', statusOrError);
    } else {
        console.info(siteName, ': ', statusOrError);
    }
    return;
}

function sendAlertMail()
{
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'yesiamsham@gmail.com',
	        pass: 'ite08005'
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
	/*// create reusable transporter object using SMTP transport
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

	});*/
}