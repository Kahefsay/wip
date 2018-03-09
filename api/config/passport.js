let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'username',
},
    function(username, password, done) {
        User.findOne({email: username}, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    message: 'Utilisateur introuvable',
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Mot de passe incorrect',
                });
            }
            return done(null, user);
        });
    }
));


