let serverConfig = require('../config');

let path = require('path');
let express = require('express');
let router = express.Router();
let User = require('../models/user');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let UserAccount = require('../models/userAccount');


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
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'root'))
        .then(() => {
          console.log("Created root directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create root directory for " + user.email + ". Error: " + error);
        });
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'tmp'))
        .then(() => {
          console.log("Created tmp directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create tmp directory for " + user.email + ". Error: " + error);
        });

      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'groups'))
        .then(() => {
          console.log("Created group directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create group directory for " + user.email + ". Error: " + error);
        });
      let userAccount = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        work: '',
        education: '',
        address: '',
        country: '',
        city: '',
        zipcode: '',
        interests: '',
      };
      UserAccount.create(userAccount);
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

/*
* Session Authentication
* */
router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'secret', function (error, decoded) {
    if (error) {
      return res.status(401).json({
        title: 'Not Authenticated.',
        error: error,
      });
    }
    next();
  });
});

/*
* Getting users
* */


router.get('/', function (req, res, next) {
    User.find({
      attributes: ['firstName', 'lastName', 'email'],
      where: {email: req.params.userId}})
      .then((users) => {
        res.status(200).json({
          message: 'Users retrieved successfully.',
          data: users,
        });
      })
});

/*
* Get user account
* */
router.get('/account', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  UserAccount.find({where: {email: req.query.userId}})
    .then((userAccount) => {
      res.status(200).json({
        message: 'User account successfully updated.',
        data: userAccount,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot update user account.',
        error: {message: 'User account not found.'},
      });
    });
});

/*
* Update user account
* */
router.patch('/account', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.body.email != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  User.find({where: {email: req.body.email}})
    .then((user) => {
      UserAccount.find({where: {email: req.body.email}})
        .then((userAccount) => {
          userAccount.updateAttributes({
            overview: req.body.overview,
            work: req.body.work,
            education: req.body.education,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            zipcode: req.body.zipcode,
            interests: req.body.interests,
          });
          res.status(200).json({
            message: 'User account successfully updated.',
            data: userAccount,
          });
        })
        .catch(() => {
          res.status(404).json({
            title: 'Cannot update user account.',
            error: {message: 'User account not found.'},
          });
        })
        .catch(() => {
          res.status(404).json({
            title: 'Cannot update user account.',
            error: {message: 'User not found.'},
          });
        });
    });
});

module.exports = router;
