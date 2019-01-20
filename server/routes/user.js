import serverConfig from '../config';

let path = require('path');
let express = require('express');
let router = express.Router();
let User = require('../models/user');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');


/*
* User Sign Up
* */
router.post('/signup', function (req, res, next) {
  let user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  User.create(user)
    .then((user) => {
      // Creates root directory for the signed up user.
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'tmp'))
        .then(() => {
          console.log("Created root directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create root directory for " + user.email + ". Error: " + error);
        });

      res.status(201).json({
        message: 'Successfully signed up.',
        userId: user.email,
      });
    })
    .catch((error) => {
      res.status(400).json({
        title: ' Signing up failed.',
        error: {message: 'Invalid Data.'},
      });
    });
});

/*
* User Signing In
* */
router.post('/signin', function (req, res, next) {
  User.find({where: {email: req.body.email}})
    .then((user) => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: 'Signing in failed.',
          error: {message: 'Invalid credentials.'},
        });
      }
      let token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
      res.status(200).json({
        message: 'Successfully signed in.',
        token: token,
        userId: user.email,
      });
    })
    .catch((error) => {
      res.status(401).json({
        title: 'Signing in failed.',
        error: {message: 'Invalid credentials.'},
      });
    });
});

module.exports = router;
