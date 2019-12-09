const jwt = require('jsonwebtoken');
const config = require('./config');

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  console.log(token);
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
    console.log('token section');
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      console.log('token found');
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Token not supplied'
    });
  }
};

module.exports = {checkToken};
