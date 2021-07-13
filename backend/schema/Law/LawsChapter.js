var mongoose = require('mongoose');
var schema = mongoose.Schema;

// Setup schema
var LawChapterSchema = mongoose.Schema({
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
    rules: {
        type: Array,
        require: true
    }
}, {collection:'LawsChapter'});

var LawsChapter = module.exports = mongoose.model('LawsChapter', LawChapterSchema);

module.exports.get = function(callback, limit) {
    LawsChapter.find(callback).limit(limit);
}