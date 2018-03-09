let User = require('../models/user');

module.exports.accueil = function(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            message: 'Profile privée',
        });
    } else {
        User.findById(req.payload._id)
        .exec(function(err, user) {
            res.status(200).json(user);
        });
    }
};
