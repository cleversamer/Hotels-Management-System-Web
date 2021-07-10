const {Hotel} = require('../models/hotel');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const hotel = await Hotel.findOne({ name: req.body.name });
    if (!hotel) return res.status(400).send('Invalid username or password.');

    const validPassword = bcrypt.compare(req.body.password, hotel.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');

    const token = hotel.generateAuthToken();
    res.send(token);
});

function validate(hotel) {
    const schema = {
        name: Joi.string().min(3).max(55).required(),
        password: Joi.string().min(8).max(32).required()
    }
    return Joi.validate(hotel, schema);
}

module.exports = router;