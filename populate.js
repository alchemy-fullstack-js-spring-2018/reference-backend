/* eslint no-console: off */
const connect = require('./lib/util/connect');
connect('mongodb://localhost:27017/pirates-test');
const mongoose = require('mongoose');


const Pirate = require('./lib/models/Pirate');
const Crew = require('./lib/models/Crew');

Promise.all([
    Pirate.find(),
    Crew.find().select('name'),
    Pirate.find()
        .populate({
            path: 'crew',
            select: 'name'
        })
])
    .then(([pirates, crews, piratesWithCrew]) => {
        console.log('pirates', pirates);
        console.log('crews', crews);
        console.log('piratesWithCrew', piratesWithCrew);
    })
    .catch(console.log)
    .then(() => mongoose.connection.close());