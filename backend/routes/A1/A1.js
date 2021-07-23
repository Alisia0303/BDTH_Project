// Initialize express router
let A1Router = require('express').Router()
// Set default API response
A1Router.get('/', function(req, res){
    res.json({
        status: 'API Its Working',
        message: 'Welcome to BDTH Application with love!'
    });
})

var A1Controller = require('../../services/A1/A1');

A1Router.route('/exams').get(A1Controller.exams)

// Export API routers
module.exports = A1Router;