const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    role: {
        ...RequiredString,
        enum: ['captain', 'crew', 'navigator', 'first sword', 'cook']
    },
    crew: String,
    joined: {
        type: Date,
        required: true,
        default: Date.now
    },
    wardrobe: {
        hat: String,
        top: String,
        bottom: String,
        shoes: RequiredString
    },
    bounty: {
        type: Number,
        min: 0
    },
    weapons: [{
        type: RequiredString,
        damage: {
            type: Number,
            required: true,
            max: 30,
            min: 1,
        }
    }]
});

module.exports = mongoose.model('Pirate', schema);
