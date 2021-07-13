// Initialize express router
let LawDescriptionRouter = require('express').Router()
// Set default API response
LawDescriptionRouter.get('/', function(req, res){
    res.json({
        status: 'API Its Working',
        message: 'Welcome to BDTH Application with love!'
    });
})

// Import VM controller
var LawDescriptionController = require('../../services/Law/LawDescription');

// VM routes
LawDescriptionRouter.route('/list').get(LawDescriptionController.index)
LawDescriptionRouter.route('/getId').get(LawDescriptionController.viewId);

// Export API routers
module.exports = LawDescriptionRouter;

