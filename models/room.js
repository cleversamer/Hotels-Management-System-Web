const mongoose = require('mongoose');
const Joi = require('joi');

const roomSchema = new mongoose.Schema({
    roomID: {
        type: Number,
        required: true
    },
    isReserved: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    owner: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 32,
        default: 'Empty'
    },
    reservationDate: {
        type: Date
    }
});

roomSchema.methods.reserve = function(owner) {
    this.owner = owner;
    this.isReserved = true;
}

roomSchema.methods.checkout = function() {
    this.isReserved = false;
}

const Room = mongoose.model('Room', roomSchema);

function validate(room) {
    const schema = {
        owner: Joi.string().min(3).max(32).required(),
        price: Joi.number()
    }
    return Joi.validate(room, schema);
}

exports.Room = Room;
exports.validate = validate;