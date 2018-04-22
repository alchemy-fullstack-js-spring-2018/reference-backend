const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
    name: RequiredString,
    flag: String,
    ships: [{
        type: Schema.Types.ObjectId,
        ref: 'Ship'
    }]
});

module.exports = mongoose.model('Crew', schema);