const mongoose = require('mongoose');
const {Room, validate} = require('./room');
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
    availableRoomsList: Array,
    reservedRoomsList: Array
});

hotelSchema.methods.initialize = function() {
    for (let roomID = 1; roomID <= this.rooms; roomID++)
        this.roomsList.push(new Room({ roomID }));

    this.availableRoomsList = { ...this.roomsList };
}

hotelSchema.methods.reserve = function(roomID, owner) {
    if (roomID < 1 || roomID > this.rooms) return false;
    
    const {error} = validate({ owner });
    if (error) return false;
    
    const room = undefined;
    const roomIndex = NaN;
    for (let i = 0; i < this.availableRoomsList.length; i++)
        if (this.availableRoomsList[i].roomID === roomID) {
            room = this.availableRoomsList[i];
            roomIndex = i;
            break;
        }  

    if (!room) return false;

    this.availableRoomsList.splice(roomIndex, 1);
    room.reserve(owner);
    this.reservedRoomsList.push(room);
}

hotelSchema.methods.findRoom = async function(roomID) {
    if (roomID < 1 || roomID > this.roomsList) return false;
    return await this.roomsList.find({ roomID: roomID });
}

hotelSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id, password: this.password }, config.get('privateKey'));
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