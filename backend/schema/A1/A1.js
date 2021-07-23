var mongoose = require('mongoose');
var schema = mongoose.Schema;

var A1Schema = mongoose.Schema({
    _id: {
        type: schema.ObjectId,
        require: true
    },
    question: {
        type: String,
        require: true
    },
    answer_list: {
        type: Array,
        require: true
    },
    right_answer: {
        type: Number,
        require: true
    },
    explain: {
        type: Array,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    class: {
        type: String,
        require: true
    },
    number: {
        type: Number,
        require: true
    }
}, {collection:'A1'})


var A1 = module.exports = mongoose.model('A1', A1Schema);

module.exports.get = function(callback, limit) {
    A1.find(callback).limit(limit);
}