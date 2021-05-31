const { Schema, model } = require('mongoose')


const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Usor', 'Mediu', 'Greu', 'Master Chef'],
        default: 'Usor'
    },
    description: {
        type: String,
        default: null
    },
    picture: {
        type: String,
        default: null
    },
    username: {
        type: String,
        // ref: 'users'
    },
    user_id: {
        type: Schema.Types.ObjectId
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true })
module.exports = model('Recipe', recipeSchema)