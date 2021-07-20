const jwt = require('jsonwebtoken');
const config = require('config');
const {Hotel} = require('../models/hotel');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('privateKey'));
    
    const hotel = await Hotel.findById(decoded._id);
    if (!hotel) return res.status(404).send('Something went wrong.');

    req.hotel = hotel;
    next();
  } 
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}