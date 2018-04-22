const router = require('express').Router();
const Ship = require('../models/Ship');
const { updateOptions } = require('../util/mongoose-helpers');
const { check404, getParam, respond } = require('../util/route-helpers');

module.exports = router
    .param('id', getParam)
    
    .post('/', respond(
        ({ body }) => Ship.create(body)
    ))
    
    .put('/:id', respond(
        ({ body, id }) => Ship.findByIdAndUpdate(id, body, updateOptions)
    ))

    .get('/:id', respond(
        ({ id }) => Ship.findById(id)
            .lean()
            .then(check404(id))
    ))
    
    .get('/', respond(
        ({ query }) => Ship.find(query)
            .lean()
            .select('name createdAt updatedAt')
            .sort({ createdAt: -1 })
            .limit(100)
    ))
    
    .delete('/:id', respond(
        ({ id }) => Ship.findByIdAndRemove(id)
            .then(deleted => ({ removed: !!deleted }))
    ));