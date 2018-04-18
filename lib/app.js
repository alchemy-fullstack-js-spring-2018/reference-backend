const express = require('express');
const app = express();
const errorHandler = require('./util/error-handler');
const pirates = require('./routes/pirates');

app.use(express.json());

app.use('/pirates', pirates);

// make sure error handler is last app.use
app.use(errorHandler());

module.exports = app;
