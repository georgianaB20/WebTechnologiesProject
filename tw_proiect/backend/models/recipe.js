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
    comments: {
        type: Array,
        default: null
    }
}, { timestamps: true })
recipeSchema.index({title: 'text'});
module.exports = model('Recipe', recipeSchema)