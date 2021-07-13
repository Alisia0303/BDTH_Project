var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Setup schema
var LawDescriptionSchema = mongoose.Schema({
    _id: {
        type: schema.ObjectId,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }
}, {collection:'LawsDescription'});

var LawsDescription = module.exports = mongoose.model('LawsDescription', LawDescriptionSchema);

// var coSchema = new mongoose.Schema({
//     _id: String,
//     description: String,
//     name: String
// }, {collection:'LawsDescription'});
// var LawsDescription = mongoose.model('LawsDescription',coSchema);

module.exports.get = function(callback, limit) {
    LawsDescription.find(callback).limit(limit);
}

