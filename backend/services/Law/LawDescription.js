const { query } = require('express');

LawDescription = require('../../schema/Law/LawDescription');

//  Handle index actions
exports.index = function(req, res){
    LawDescription.get(function(err, law) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Law Description retrieved successfully",
            data: law
        });
    });
};

exports.viewId = function(req, res){
    console.log(req.query);
    LawDescription.findById(req.query._id, function(err, vm)
    {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'VM detail following VM',
            data: vm
        });
    });
};