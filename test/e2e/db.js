require('dotenv').config({ path: './test/e2e/.env' });
const connect = require('../../lib/connect');
const mongoose = require('mongoose');

before(() => connect(process.env.MONGODB_URI));    
after(() => mongoose.connection.close());