const { query } = require('express');

LawsRule = require('../../schema/Law/LawsRule');

//  Handle index actions
exports.index = function(req, res){
    LawsRule.get(function(err, law) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: "Law Rule retrieved successfully",
                count: law.length,
                data: law
            });
        }
        
    });
};

exports.viewNumber = function(req, res){
    console.log(req.query);
    var query = {number: req.query.number}
    LawsRule.find(query, function(err, law)
    {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Law Rule detail following',
            count: law.length,
            data: law
        });
    });
};