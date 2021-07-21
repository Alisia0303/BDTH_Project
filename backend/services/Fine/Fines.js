const { query } = require('express');

Fines = require('../../schema/Fine/Fines');

//  Handle index actions
exports.index = function(req, res){
    console.log(req.query);
    let query = {}
    if (req.query && req.query.aviolation) query.aviolation = req.query.aviolation
    Fines.find( query, function(err, fines) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else {
            if (req.query && req.query.types) query.types = req.query.types
            console.log("Fine begin", fines[0])
            if (query.types === 'car') fines = fines.map(({_id, id, aviolation, name, alias, content, car, motor, bike, keywords, view, published}) => ({_id, id, aviolation, name, alias, content, car, keywords, view, published}))
            if (query.types === 'motor') fines = fines.map(({_id, id, aviolation, name, alias, content, car, motor, bike, keywords, view, published}) => ({_id, id, aviolation, name, alias, content, motor, keywords, view, published}))
            if (query.types === 'bike') fines = fines.map(({_id, id, aviolation, name, alias, content, car, motor, bike, keywords, view, published}) => ({_id, id, aviolation, name, alias, content, bike, keywords, view, published}))
            console.log("Fines after type", fines)
            res.json({
                status: "success",
                message: "Fines retrieved successfully",
                count: fines.length,
                data: fines
            });
        }
        
    });
};