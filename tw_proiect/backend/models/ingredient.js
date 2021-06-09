const { Schema, model } = require('mongoose')


const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    includes: {
        type: Number,
        required: true,
        default: 0
    },
    excludes: {
        type: Number,
        required: true,
        default: 0
    }
})
module.exports = model('Ingredient', ingredientSchema)