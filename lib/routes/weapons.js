const router = require('express').Router();
const Pirate = require('../models/Pirate');
const { updateOptions } = require('../util/mongoose-helpers');
const { check404, getParam, respond } = require('../util/route-helpers');

module.exports = router
    .param('weaponId', getParam)

    .post('/', respond(
        ({ id, body }) => Pirate.findByIdAndUpdate(id, {
            $push: { weapons: body }
        }, updateOptions)
            .then(pirate => {
                return pirate.weapons[pirate.weapons.length - 1];
            })
    ))
    
    .put('/:weaponId', respond(
        ({ id, weaponId, body }) => {
            const { type, damage } = body;

            return Pirate.findOneAndUpdate({
                '_id': id, 'weapons._id': weaponId
            }, {
                $set: {
                    'weapons.$.type': type,
                    'weapons.$.damage': damage
                }
            }, updateOptions)
                .then(pirate => {
                    check404(id)(pirate);
                    return pirate.weapons.find(w => w._id == weaponId);
                });
        }
    ))
    
    .delete('/:weaponId', respond(
        ({ id, weaponId }) => {

            return Pirate.findByIdAndUpdate(id, {
                $pull: { 
                    weapons: { _id: weaponId }
                }
            }, updateOptions)
                .then(pirate => {
                    check404(id)(pirate);
                    return { count: pirate.weapons.length };
                });
        }
    ));