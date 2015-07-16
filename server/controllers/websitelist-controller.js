var Monitor   = require('../models/websites');
var Curl      = require('node-libcurl').Curl;
var socketMVC = require('socket.mvc');
 
/*Login logic*/

module.exports.create = function(req, res) {
    var monitor = new Monitor(req.body);
    monitor.save(function(err, result) {
        res.json(result);

        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    console.log(err.errors[field].message)
                }
            } else {
                console.log(err.errors[field].message)
                
            }
        }
        else
        {
            startWebsiteWatchTimer(result.url, result.pollInterval, result.name);
            console.log(result.name);
            console.log(result.url);
            console.log(result.pollInterval);
        }
    });
}

var timers = [];

function startWebsiteWatchTimer(url, seconds, name)
{
    timers[name] = setInterval(function(){
        console.log(name + "  " + url);
        checkStatus(url, name);
    }, seconds * 1000);    
}

function checkStatus(url, name)
{
    var curl = new Curl();
    curl.setOpt('URL', url);
    curl.setOpt( Curl.option.TIMEOUT, 30 );
    curl.setOpt('FOLLOWLOCATION', true);

    curl.on('end', function(statusCode, body, headers) {

        console.info( 'URL', url);
        console.info( 'Status Code: ', statusCode );
        socketMVC.everyone('websiteStatus', {'name' : name, 'statusCode' : statusCode});
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

/*
setTimeout(function(){
clearInterval(timers["sophie"]);
clearInterval(timers[1]);
console.log('interval cleared');
},6000);
*/
