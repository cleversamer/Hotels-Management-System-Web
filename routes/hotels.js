const {Hotel, validate} = require('../models/hotel');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/:hotel', async (req, res) => {
    const hotel = await Hotel.findOne({ name: req.params.hotel });    
    if (!hotel) return res.status(400).send('Hotel with the given name was not exist.');
    res.send(_.pick(hotel, ['name', 'rooms', 'dateCreated']));
});

router.get('/:hotel/:roomID', async (req, res) => {
    const hotel = await Hotel.findOne({ name: req.params.hotel });    
    if (!hotel) return res.status(400).send('Hotel with the given name was not exist.');

    const room = hotel.findRoom(req.params.roomID);
    if (!room) res.status(400).send('Invalid roomID.');

    res.send(room);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    req.body.name += '\'s Hotel';
    let hotel = await Hotel.findOne({ name: req.body.name });
    if (hotel) return res.status(400).send('Hotel\'s name already used.');

    hotel = new Hotel(_.pick(req.body, ['name', 'password', 'rooms', 'dateCreated']));
    hotel.initialize();
    const salt = await bcrypt.genSalt(10);
    hotel.password = await bcrypt.hash(hotel.password, salt);
    await hotel.save();

    const token = hotel.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(hotel, ['name', 'rooms', 'dateCreated']));
});

// router.post('/:hotel', (req, res) => {
//     const hotel = await Hotel.findOne({ name: req.params.hotel });    
//     if (!hotel) return res.status(400).send('Hotel with the given name was not exist.');

    
// });

module.exports = router;