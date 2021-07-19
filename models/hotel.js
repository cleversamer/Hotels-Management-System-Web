const mongoose = require('mongoose');
const Room = require('./room');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 55
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 255
    },
    rooms: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 1
    },
    dateCreated: {
        type: Date,
        required: true,
        default: new Date()
    },
    roomsList: Array,
    reservedRoomsList: Array
});

hotelSchema.methods.initialize = function() {
    const defaultPrice = 0;
    for (let roomID = 1; roomID <= this.rooms; roomID++)
        this.roomsList.push(new Room('Unknown', roomID, defaultPrice));
}

hotelSchema.methods.reserve = function(roomID, owner) {
    owner = owner.trim();
    if (roomID < 1 || roomID > this.rooms) return false;
    if (owner.length < 3 || owner.length > 26) return false;

    const room = this.roomsList[roomID - 1];
    reserve(room, owner);

    this.reservedRoomsList.push(room);
    return true;
}

hotelSchema.methods.findRoom = function(roomID) {
    roomID = parseInt(roomID);
    if (roomID < 1 || roomID > this.rooms) return false;
    return this.roomsList[roomID - 1];
}

hotelSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id }, config.get('privateKey'));
    return token;
}

const Hotel = mongoose.model('Hotel', hotelSchema);

function validateHotel(hotel) {
    const schema = {
        name: Joi.string().min(3).max(55).required(),
        password: Joi.string().min(8).max(255).required(),
        rooms: Joi.number().integer().min(0).max(500)
    }
    return Joi.validate(hotel, schema);
}

exports.Hotel = Hotel;
exports.validate = validateHotel;