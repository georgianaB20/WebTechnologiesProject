const {Schema, model} = require('mongoose')

const commentSchema = new Schema(
    {
        comment: {
            type: String
        },
        picture:{
            type: String,
            default:null
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    }
)

module.exports = model('Comment', commentSchema)