// Initialize express router
let LawsRuleRouter = require('express').Router()
// Set default API response
LawsRuleRouter.get('/', function(req, res){
    res.json({
        status: 'API Its Working',
        message: 'Welcome to BDTH Application with love!'
    });
})

// Import VM controller
var LawsRuleController = require('../../services/Law/LawsRule');

// VM routes
LawsRuleRouter.route('/list').get(LawsRuleController.index)
LawsRuleRouter.route('/getNumber').get(LawsRuleController.viewNumber);

// Export API routers
module.exports = LawsRuleRouter;

