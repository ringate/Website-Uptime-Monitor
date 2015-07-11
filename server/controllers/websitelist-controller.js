var Monitor = require('../models/websites')

module.exports.create = function(req, res){
	var monitor = new Monitor(req.body);
	monitor.save(function (err, result) {
		res.json(result);
	});
}

module.exports.list = function(req, res){
	Monitor.find({}, function(err, results){
		res.json(results);
	});
}