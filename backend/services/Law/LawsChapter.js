const { query } = require('express');

LawsChapter = require('../../schema/Law/LawsChapter');

//  Handle index actions
exports.index = function(req, res){
    LawsChapter.get(function(err, law) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            res.json({
                status: "success",
                message: "Law Chapter retrieved successfully",
                count: law.length,
                data: law
            });
        }
        
    });
};

exports.viewNumber = function(req, res){
    console.log(req.query);
    var query = {number: req.query.number}
    LawsChapter.find(query, function(err, law)
    {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Law Chapter detail following',
            count: law.length,
            data: law
        });
    });
};