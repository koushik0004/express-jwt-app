const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');

const config = require('./config');
const middleware = require('./middleware');

const users = [
  {
    id: 1,
    username: 'test',
    password: 'asdf123'
  },
  {
    id: 2,
    username: 'test2',
    password: 'asdf12345'
  }
];

class HandleGenerator {
  login (req, res) {
    const { username, password } = req.body;
    const expTime = 60 * 60 * 60;
    let token = '';
    if (username && password) {
      for (let user of users) {
        console.log(JSON.stringify(user));
        if (username === user.username && password === user.password) {
          token = jwt.sign({id: user.id, user: user.username}, config.secret, {expiresIn: expTime.toString()});
          return res.status(200).json({
            sucess: true,
            err: null,
            token
          });
        }
      }
      return res.status(401).json({
        sucess: false,
        err: 'incorect combination',
        token: null
      });
    } else {
      return res.status(401).json({
        sucess: false,
        err: 'username and password should be sent',
        token: null
      });
    }
  }
  index (req, res) {
    return res.status(200).json({
      success: true,
      message: 'Index page',
      requestBody: req.body
    });
  }
}

const main = () => {
  // Instantiating the express app
  const app = express();
  // See the react auth blog in which cors is required for access
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4009');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  const handlers = new HandleGenerator();
  const port = process.env.PORT || 4009;

  app.post('/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
};

main();
