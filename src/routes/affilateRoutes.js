
const express = require('express');
const { affiliateLogin, affiliateSignup } = require('../controllers/affiliate/affilateController');


const affilateRoute = express.Router()


affilateRoute.post('/affiliatelogin', affiliateLogin)
affilateRoute.post('/affiliatesignup', affiliateSignup)



module.exports = affilateRoute;