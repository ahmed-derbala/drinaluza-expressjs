const { checkSchema, body, query, oneOf } = require('express-validator')

module.exports.signinVld = [oneOf([body('email').trim().isEmail(), body('username').trim().notEmpty().isString()]), body('password').trim().isString().notEmpty()]

module.exports.signupVld = [oneOf([body('email').trim().isEmail(), body('username').trim().notEmpty().isString()]), body('password').trim().isString().notEmpty()]
