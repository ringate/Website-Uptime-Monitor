var Monitor = require('../models/websites')

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
    });
}