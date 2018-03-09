/* eslint new-cap: [0] */
let express = require('express');
let router = express.Router();
let jwt = require('express-jwt');

let auth = jwt({
    secret: 'secret',
    userProperty: 'payload',
});

let ctrlAccueil = require('../controllers/accueil');
let ctrlAuth = require('../controllers/authentication');

// profile
router.get('/accueil', auth, ctrlAccueil.accueil);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
