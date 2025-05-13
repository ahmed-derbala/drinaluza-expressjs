const { objectIdValidator } = require('../../core/validation/')
const { checkSchema, body, query } = require('express-validator')

module.exports.findOneIdentityVld = [body('match').isObject().notEmpty(), body('facebook').isObject().optional(), body('facebook.url').notEmpty().optional()]

module.exports.createIdentityVld = [body('facebook').isObject(), body('facebook.url').notEmpty(), body('rating').isObject(), body('rating.value').notEmpty()]
