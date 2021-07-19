const {Hotel, validate} = require('../models/hotel');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// My Hotel
router.get('/me', auth, async (req, res) => {
    const hotel = await Hotel.findById(req.hotel._id).select('-password');
    res.send(_.pick(hotel, ['name', 'rooms', 'dateCreated']));
});

// GET hotel
router.get('/:name', async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ name: req.params.name });
        if (!hotel) return res.status(404).send('Hotel with the given name was not exist.');
        res.send(_.pick(hotel, ['name', 'rooms', 'dateCreated']));
    }
    catch (ex) {
        res.send('Something went wrong.');
    }
});

// Create hotel
router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let hotel = await Hotel.findOne({ name: req.body.name });
        if (hotel) return res.status(400).send('Hotel\'s name already used.');
        
        hotel = new Hotel(_.pick(req.body, ['name', 'password', 'rooms', 'dateCreated']));
        hotel.initialize();
        const salt = await bcrypt.genSalt(10);
        hotel.password = await bcrypt.hash(hotel.password, salt);
        hotel = await hotel.save();

        const token = hotel.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(hotel, ['name', 'rooms', 'dateCreated']));
    }
    catch (ex) {
        console.log(ex);
        res.send('Something went wrong.');
    }
});

// GET room by ID
router.get('/room/:roomID', auth, async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.hotel._id);    
        if (!hotel) return res.status(400).send('Hotel with the given name was not exist.');
    
        const room = hotel.findRoom(req.params.roomID);
        if (!room) res.status(400).send('Room with the given ID was not found.');
    
        res.send(room);
    }
    catch (ex) {
        res.send('Something went wrong.');
    }
});

// Reserve room
router.put('/room/reserve/:roomID/:owner', auth, async (req, res) => {
    try {
        let hotel = await Hotel.findById(req.hotel._id);
        
        const roomID = parseInt(req.params.roomID);
        const owner = req.params.owner;
        hotel.reserve(roomID, owner);
        hotel = await hotel.save();

        res.send(_.pick(hotel, ['name', 'rooms', 'dateCreated']));
    }
    catch (ex) {
        console.log(ex);
        res.send('Something went wrong.');
    }
});

module.exports = router;