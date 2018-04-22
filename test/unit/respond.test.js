const { assert } = require('chai');
const respond = require('../../lib/util/respond');
describe('respond middleware wrapper', () => {
   
    it('sends promise resolve', done => {
        const data = [];
        const req = {};
        const res = {
            json(json) { 
                assert.equal(json, data);
                done(); 
            }
        };

        const fn = request => {
            assert.equal(request, req);
            return Promise.resolve(data);
        };

        const middleware = respond(fn);
        middleware(req, res);
    });

    it('calls next with promise reject', done => {
        const error = {};
        const fn = () => Promise.reject(error);

        const middleware = respond(fn);
        middleware(null, null, err => {
            assert.equal(err, error);
            done();
        });
    });
});