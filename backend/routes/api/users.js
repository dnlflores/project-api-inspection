const express = require('express');
// const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please enter your firstName'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please enter your lastName'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    let isUserNameTaken = await User.findOne({
      where: { username: username }
    });
    if (isUserNameTaken) {
      res.status(403);
      return res.json({
        message: 'User already exists',
        statusCode: 403,
        errors: [
          'User with that username already exists'
        ]
      });
    } else{
      res.status(401);
      return res.json({
        message: 'Login failed',
        statusCode: 401,
        errors: [
          'Invalid credentials'
        ]
      });
    }
    let emailChecker = await User.findOne({
      where: { email: email }
    });
    if (emailChecker) {
      res.status(403);
      return res.json({
        message: 'User already exists',
        statusCode: 403,
        errors: [
          'User with that email already exists'
        ]
      });
    }

    if (!firstName || !lastName || !username || !email) {
      res.status(400);
      let errorArray = [];
      if (!firstName) {
        errorArray.push('First Name is required');
      }
      if (!lastName) {
        errorArray.push('Last Name is required');
      }
      if (!username) {
        errorArray.push('Username is required',)
      }
      if (!email) {
        errorArray.push('Invalid email');
      }
      return res.json({
        message: 'Validation error',
        statusCode: 400,
        errors: errorArray
      });
    }
    // const { setTokenCookie } = require('../../utils/auth.js');
    // const { User } = require('../../db/models');
    // router.get('/set-token-cookie', async (_req, res) => {
    //   const user = await User.findOne({
    //       where: {
    //         username: 'Demo-lition'
    //       }
    //     });
    //   setTokenCookie(res, user);
    //   return res.json({ user: user });
    // });
    const user = await User.signup(
      {
        firstName,
        lastName,
        email,
        username,
        password
      }
    );

    const token = setTokenCookie(res, user);
      res.status(200);
    return res.json({
      // user: user
      statusCode: 200,
      user: user,
      token: token
      // {
      //   id: user.id,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   email: user.email,
      //   username: user.username,
      //   token: token
      // }
      // {
      //   id,
      //   firstName,
      //   lastName,
      //   email,
      //   userName
      // }
    });
  }
);

module.exports = router;
