const { assert } = require('chai');
const request = require('./request');
const Pirate = require('../../lib/models/Pirate');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Pirate API', () => {

    before(() => dropCollection('pirates'));

    let luffy = {
        name: 'Monkey D. Luffy',
        role: 'captain',
        crew: 'Straw Hat Pirates',
        wardrobe: {
            shoes: 'flip-flops'
        },
        weapons: []
    };

    let zoro = {
        name: 'Roronoa Zoro',
        role: 'crew',
        crew: 'Straw Hats',
        wardrobe: {
            shoes: 'boots'
        },
        weapons: []
    };

    // remember we started with this!
    // it.skip('saves and gets a pirate', () => {
    //     return new Pirate(luffy).save()
    //         .then(saved => {
    //             saved = saved.toJSON();
    //             const { _id, __v, joined } = saved;
    //             assert.ok(_id);
    //             assert.equal(__v, 0);
    //             assert.ok(joined);
    //             assert.deepEqual(saved, {
    //                 _id, __v, joined,
    //                 ...luffy
    //             });
    //             luffy = saved;
    //             return Pirate.findById(saved._id).lean();
    //         })
    //         .then(found => {
    //             assert.deepEqual(found, luffy);
    //         });
    // });

    it('saves and gets a pirate', () => {
        return request.post('/pirates')
            .send(luffy)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, joined } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(joined);
                assert.deepEqual(body, {
                    _id, __v, joined,
                    ...luffy
                });
                luffy = body;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets a pirate by id', () => {
        return Pirate.create(zoro).then(roundTrip)
            .then(saved => {
                zoro = saved;
                return request.get(`/pirates/${zoro._id}`);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
            });
    });

    it('update a pirate', () => {
        zoro.role = 'first sword';

        return request.put(`/pirates/${zoro._id}`)
            .send(zoro)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, zoro);
                return Pirate.findById(zoro._id).then(roundTrip);
            })
            .then(updated => {
                assert.deepEqual(updated, zoro);
            });
    });

    const getFields = ({ _id, name, role, crew }) => ({ _id, name, role, crew });

    it('gets all pirates but only _id, name, role and crew', () => {
        return request.get('/pirates')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [luffy, zoro].map(getFields));
            });
    });

    it('queries pirates', () => {
        return request.get('/pirates?role=captain')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [luffy].map(getFields));
            });
    });

    it('deletes a pirate', () => {
        return request.delete(`/pirates/${zoro._id}`)
            .then(checkOk)
            .then(() => {
                return Pirate.findById(zoro._id);
            })
            .then(found => {
                assert.isNull(found);
            });
    });

    it('returns 404 on get of non-existent id', () => {
        return request.get(`/pirates/${zoro._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, /^Pirate id/);
            });
    });

    describe('Pirate Weapons API', () => {

        let kick = { type: 'kick', damage: 14 };

        it('adds a weapon', () => {

            return request.post(`/pirates/${luffy._id}/weapons`)
                .send(kick)
                .then(checkOk)
                .then(({ body }) => {
                    assert.ok(body._id);
                    assert.deepEqual(body, { _id: body._id, ...kick });
                    kick = body;
                });
        });

        it('updates a weapon', () => {
            kick.damage = 18;

            return request.put(`/pirates/${luffy._id}/weapons/${kick._id}`)
                .send(kick)
                .then(checkOk)
                .then(() => {
                    return Pirate.findById(luffy._id).select('weapons');
                })
                .then(pirate => {
                    assert.equal(pirate.weapons[0].damage, kick.damage);
                });
        });

        it('removes a weapon', () => {
            
            return request.delete(`/pirates/${luffy._id}/weapons/${kick._id}`)
                .then(checkOk)
                .then(() => {
                    return Pirate.findById(luffy._id).select('weapons');
                })
                .then(pirate => {
                    assert.equal(pirate.weapons.length, 0);
                });
        });
    });
});