var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Setup schema
var FineSchema = mongoose.Schema({
    _id: {
        type: schema.ObjectId,
        require: true
    },
    id: {
        type: Number,
        require: true
    },
    aviolation: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    alias: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    car: {
        type: Array,
        require: true
    },
    motor: {
        type: Array,
        require: true
    },
    bike: {
        type: Array,
        require: true
    },
    keywords: {
        type: String,
        require: true
    },
    view: {
        type: String,
        require: true
    },
    published: {
        type: Number,
        require: true
    }
    
}, {collection:'Fines'});

var Fines = module.exports = mongoose.model('Fines', FineSchema);

module.exports.get = function(callback, limit) {
    Fines.find(callback).limit(limit);
}