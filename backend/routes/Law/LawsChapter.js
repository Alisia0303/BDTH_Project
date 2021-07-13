// Initialize express router
let LawsChapterRouter = require('express').Router()
// Set default API response
LawsChapterRouter.get('/', function(req, res){
    res.json({
        status: 'API Its Working',
        message: 'Welcome to BDTH Application with love!'
    });
})

// Import VM controller
var LawsChapterController = require('../../services/Law/LawsChapter');

// VM routes
LawsChapterRouter.route('/list').get(LawsChapterController.index)
LawsChapterRouter.route('/getNumber').get(LawsChapterController.viewNumber);

// Export API routers
module.exports = LawsChapterRouter;

