const { defaultConfiguration } = require('express/lib/application')
const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const userNameValidator = [
    validate({ validator: 'isLength', arguments: [3, 20], msg: 'Username must be between 3 and 20 characters' }),
    validate({ validator: 'isAlphanumeric', msg: 'Username must contain only letters and numbers' })
]

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        validate: userNameValidator
    }
})

exports.User = mongoose.model('User', userSchema)

const exerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: userNameValidator
    }, 
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: [10, 'Duration must be greater than 10'],
        max: [300, 'Duration must be less than 300']
    },
    date: {
        type: Date,
        default: Date.now
    }
})

exports.Exercise = mongoose.model('Exercise', exerciseSchema)

