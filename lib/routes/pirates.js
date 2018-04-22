const router = require('express').Router();
const Pirate = require('../models/Pirate');
const { getParam, respond } = require('../util/route-helpers');
const weapons = require('./weapons');

module.exports = router
    .param('id', getParam)

    .post('/', respond(
        ({ body }) => Pirate.create(body)
    ))
    
    .put('/:id', respond(
        ({ id, body }) => Pirate.updateById(id, body)
    ))

    .get('/:id', respond(
        ({ id }) => Pirate.findById(id)
            .lean()
            .populate({
                path: 'crew',
                select: 'name'
            })
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