const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const http = require('http');

const app = require('../../lib/app');

const server = http.createServer(app);
const request = chai.request(server).keepOpen();

after(() => server.close());

request.checkOk = res => {
    if(!res.ok) throw res.error;
    return res;
};

module.exports = request;