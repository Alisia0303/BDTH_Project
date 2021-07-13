var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Setup schema
var LawRuleSchema = mongoose.Schema({
    _id: {
        type: schema.ObjectId,
        require: true
    },
    number: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    content: {
        type: Array,
        require: true
    },
    chapter: {
        type: String,
        require: true
    }
}, {collection:'LawsRule'});

var LawsRule = module.exports = mongoose.model('LawsRule', LawRuleSchema);

module.exports.get = function(callback, limit) {
    LawsRule.find(callback).limit(limit);
}