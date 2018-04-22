const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Crews API', () => {

    before(() => dropCollection('ships'));
    before(() => dropCollection('pirates'));
    before(() => dropCollection('crews'));

    let sunny = { name: 'Sunny', sails: 5 };

    before(() => {
        return request.post('/api/ships')
            .send(sunny)
            .then(({ body }) => {
                sunny = body;
            });
    });

    let strawHats = {
        name: 'Straw Hats',
        flag: 'https://images-na.ssl-images-amazon.com/images/I/814tPeVWRDL._SL1500_.jpg',
        ships: []
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a crew', () => {
        strawHats.ships.push(sunny._id);

        return request.post('/api/crews')
            .send(strawHats)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...strawHats,
                    _id, __v 
                });
                strawHats = body;
            });
    });

    let luffy = {
        name: 'Monkey D. Luffy',
        role: 'captain',
        crew: 'Straw Hat Pirates',
        wardrobe: {
            shoes: 'flip-flops'
        },
        weapons: []
    };

    it('adds pirate to crew', () => {
        luffy.crew = strawHats._id;
        return request.post('/api/pirates')
            .send(luffy)
            .then(({ body }) => {
                luffy = body;
            });
    });

    it('gets a crew by id', () => {
        return request.get(`/api/crews/${strawHats._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    ...strawHats,
                    pirates: [{
                        _id: luffy._id,
                        name: luffy.name
                    }],
                    ships: [{
                        _id: sunny._id,
                        name: sunny.name
                    }]
                });
            });
    });

    const getFields = ({ _id, name }) => ({ _id, name });

    it('gets all crews with pirate count', () => {
        return request.get('/api/crews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [strawHats].map(getFields));
            });
    });

    it('returns 404 on get of non-existent id', () => {
        const noExistId = Types.ObjectId();
        return request.get(`/api/crews/${noExistId}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, new RegExp(noExistId));
            });
    });

    it('returns 400 on attempt to delete crew with pirates', () => {
        return request.delete(`/api/crews/${strawHats._id}`)
            .then(response => {
                assert.equal(response.status, 400);
                assert.match(response.body.error, /^Cannot delete/);
            });      
    });

    it('can delete crew when no pirates', () => {
        luffy.crew = null;
        return request.put(`/pirates/${luffy._id}`)
            .send(luffy)
            .then(() => {
                return request.delete(`/api/pirates/${strawHats._id}`);
            })
            .then(response => {
                assert.equal(response.status, 200);
            });      
    });
});