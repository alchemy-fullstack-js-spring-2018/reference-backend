const router = require('express').Router();
const Crew = require('../models/Crew');
const Pirate = require('../models/Pirate');
const { updateOptions } = require('../util/mongoose-helpers');
const { check404, getParam, respond } = require('../util/route-helpers');

module.exports = router
    .param('id', getParam)

    .post('/', respond(
        ({ body }) => Crew.create(body)
    ))
    
    .put('/:id', respond(
        ({ body, id }) => Crew.findByIdAndUpdate(id, body, updateOptions)
    ))

    .get('/:id', respond(({ id }) => {
        return Promise.all([
            Crew.findById(id)
                .populate({
                    path: 'ships',
                    select: 'name'
                })
                .lean(),
            
            Pirate.find({ crew: id })
                .lean()
                .select('name')
        ])
            .then(([crew, pirates]) => {
                check404(id)(crew);
                crew.pirates = pirates;
                return crew;
            });
    }))
    
    .get('/', respond(
        ({ query }) => Crew.find(query)
            .lean()
            .select('name')
    ))
    
    .delete('/:id', respond(({ id }) => {

        return Pirate.find({ crew: id })
            .count()
            .then(count => {
                if(count > 0) throw {
                    status: 400,
                    error: 'Cannot delete crew with pirates'
                };
                
                return Crew.findByIdAndRemove(id);
            })
            .then(deleted => ({ removed: !!deleted }));
    }));