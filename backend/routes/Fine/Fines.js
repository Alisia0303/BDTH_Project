// Initialize express router
let FineRouter = require('express').Router()
// Set default API response
FineRouter.get('/', function(req, res){
    res.json({
        status: 'API Its Working',
        message: 'Welcome to BDTH Application with love!'
    });
})

// Import VM controller
var FineController = require('../../services/Fine/Fines');

// VM routes
FineRouter.route('/list').get(FineController.index)

// Export API routers
module.exports = FineRouter;

