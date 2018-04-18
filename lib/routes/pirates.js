const router = require('express').Router();
const Pirate = require('../models/Pirate');
const { updateOptions } = require('../util/mongoose-helpers');

module.exports = router
    .post('/', (req, res, next) => {
        Pirate.create(req.body)
            .then(pirate => res.json(pirate))
            .catch(next);
    })
    
    .put('/:id', (req, res, next) => {
        Pirate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .then(pirate => res.json(pirate))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Pirate.findById(id)
            .lean()
            .then(pirate => {
                if(!pirate) {
                    next({
                        status: 404,
                        error: `Pirate id ${id} does not exist`
                    });
                }
                else res.json(pirate);
            })
            .catch(next);
    })
    
    .get('/', (req, res, next) => {
        Pirate.find(req.query)
            .lean()
            .select('name crew role')
            .then(pirates => res.json(pirates))
            .catch(next);
    })
    
    .delete('/:id', (req, res, next) => {
        Pirate.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    })
    
    .post('/:id/weapons', (req, res, next) => {
        const { id } = req.params;

        Pirate.findByIdAndUpdate(id, {
            $push: { weapons: req.body }
        }, updateOptions)
            .then(pirate => {
                if(!pirate) {
                    next({
                        status: 404,
                        error: `Pirate id ${id} does not exist`
                    });
                }
                res.json(pirate.weapons[pirate.weapons.length - 1]);
            })
            .catch(next);
    })
    
    .put('/:id/weapons/:weaponId', (req, res, next) => {
        const { body, params } = req;
        const { id, weaponId } = params;

        Pirate.findOneAndUpdate({ 
            'weapons._id': weaponId
        }, {
            $set: { 
                'weapons.$.type': body.type, 
                'weapons.$.damage': body.damage 
            }
        }, updateOptions)
            .then(pirate => {
                if(!pirate) {
                    next({
                        status: 404,
                        error: `Pirate id ${id} does not exist`
                    });
                }
                res.json();
            })
            .catch(next);
    })
    
    .delete('/:id/weapons/:weaponId', (req, res, next) => {
        const { id, weaponId } = req.params;

        Pirate.findByIdAndUpdate(id, {
            $pull: { weapons: { _id: weaponId } }
        }, updateOptions)
            .then(pirate => {
                if(!pirate) {
                    next({
                        status: 404,
                        error: `Pirate id ${id} does not exist`
                    });
                }
                res.json();
            })
            .catch(next);
    });