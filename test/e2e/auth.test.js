const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Auth API', () => {

    beforeEach(() => dropCollection('users'));

    let token = null;

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('signin', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

    it('Gives 400 on signup of same email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email exists');
            });
    });
});