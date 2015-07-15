var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Curl = require('node-libcurl').Curl,
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

app.listen(3000, function() {
    console.log('Listening ...');
});

checkStatus('http://www.facebook.com/404');
checkStatus('http://www.google.com/404');
checkStatus('http://anandhsomu.com');
checkStatus('http://anandhsomasddadadu.com');

function checkStatus(url)
{
	var curl = new Curl();
	curl.setOpt('URL', url);
	curl.setOpt( Curl.option.TIMEOUT, 30 );
	curl.setOpt('FOLLOWLOCATION', true);

	curl.on('end', function(statusCode, body, headers) {

		console.info( 'URL', url);
	    console.info( 'Status Code: ', statusCode );
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