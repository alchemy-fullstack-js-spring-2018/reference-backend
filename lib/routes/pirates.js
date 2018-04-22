const router = require('express').Router();
const Pirate = require('../models/Pirate');
const { updateOptions } = require('../util/mongoose-helpers');
const { check404, getParam, respond } = require('../util/route-helpers');
const weapons = require('./weapons');

module.exports = router
    .param('id', getParam)

    .post('/', respond(req => Pirate.create(req.body)))
    
    .put('/:id', respond(
        ({ id, body }) => Pirate.findByIdAndUpdate(id, body, updateOptions)
    ))

    .get('/:id', respond(
        ({ id }) => Pirate.findById(id)
            .lean()
            .populate({
                path: 'crew',
                select: 'name'
            })
            .then(check404(id))
    ))
    
    .get('/', respond(
        ({ query }) => Pirate.find(query)
            .lean()
            .select('name crew role')
            .populate({
                path: 'crew',
                select: 'name'
            })
    ))
    
    .delete('/:id', respond(
        ({ id }) => Pirate.findByIdAndRemove(id)
            .then(deleted => ({ removed: !!deleted }))
    ))
    
    .use('/:id/weapons', weapons);