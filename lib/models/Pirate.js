const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
    name: RequiredString,
    role: {
        ...RequiredString,
        enum: ['captain', 'crew', 'navigator', 'first sword', 'cook']
    },
    crew: {
        type: Schema.Types.ObjectId,
        ref: 'Crew'
    },
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

schema.statics = {
    addWeapon(id, weapon) {
        return this.updateById(id, {
            $push: { weapons: weapon }
        }).then(pirate => {
            return pirate.weapons[pirate.weapons.length - 1];
        });
    },
    updateWeapon(id, weaponId, weapon) {
        return this.updateOne({
            '_id': id, 
            'weapons._id': weaponId
        }, {
            $set: { 'weapons.$': weapon }
        })
            .then(pirate => {
                if(!pirate) return null;
                return pirate.weapons.find(w => w._id == weaponId);
            });
    },
    removeWeapon(id, weaponId) {
        return this.updateById(id, {
            $pull: { 
                weapons: { _id: weaponId }
            }
        })
            .then(pirate => {
                if(!pirate) return null;
                return { count: pirate.weapons.length };
            });
    }
};

module.exports = mongoose.model('Pirate', schema);