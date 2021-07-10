const express = require('express');
const hotels = require('../routes/hotels');

module.exports = function(app) {
    app.use(express.json());
    app.use('/hotel', hotels);
}