const { assert } = require('chai');
const Pirate = require('../../lib/models/Pirate');

describe('Pirate model', () => {

    it('valid good model', () => {
        const data = {
            name: 'Monkey D. Luffy',
            role: 'captain',
            crew: 'Straw Hats',
            joined: new Date(),
            wardrobe: {
                hat: 'straw',
                top: 'red vest',
                bottom: 'trousers',
                shoes: 'flip flops'
            },
            bounty: 300000000,
            weapons: [{
                type: 'punch',
                damage: 14
            }]
        };

        const pirate = new Pirate(data);

        data._id = pirate._id;
        data.weapons[0]._id = pirate.weapons[0]._id;
        assert.deepEqual(pirate.toJSON(), data);

        assert.isUndefined(pirate.validateSync());
    });

    it('has default date of now', () => {
        const pirate = new Pirate({ name: 'bob' });
        assert.ok(pirate.joined);
        assert.isAtMost(pirate.joined - Date.now(), 5);
    });

    const getValidationErrors = validation => {
        assert.isDefined(validation, 'expected validation errors but got none');
        return validation.errors;
    };

    it('required fields', () => {
        const pirate = new Pirate({});
        const errors = getValidationErrors(pirate.validateSync());
        assert.equal(Object.keys(errors).length, 3);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.role.kind, 'required');
        assert.equal(errors['wardrobe.shoes'].kind, 'required');
    });

    it('role must be enum, bounty must be positive number', () => {
        const pirate = new Pirate({
            name: 'test', 
            crew: 'test', 
            role: 'bad',
            bounty: -500
        });
        const errors = getValidationErrors(pirate.validateSync());
        assert.equal(errors['role'].kind, 'enum');
        assert.equal(errors['bounty'].kind, 'min');
    });

    it('weapon damage at least 1', () => {
        const pirate = new Pirate({
            weapons: [
                { type: 'too small', damage: 0 },
            ]
        });
        const errors = getValidationErrors(pirate.validateSync());
        assert.equal(errors['weapons.0.damage'].kind, 'min');
    });

    it('weapon damage not more than 30', () => {
        const pirate = new Pirate({
            weapons: [
                { type: 'too big', damage: 31 },
            ]
        });
        const errors = getValidationErrors(pirate.validateSync());
        assert.equal(errors['weapons.0.damage'].kind, 'max');
    });
});