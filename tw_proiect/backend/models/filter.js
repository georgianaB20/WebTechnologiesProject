const { Schema, model } = require('mongoose')


const searchSchema = new Schema({
    user_id: {
        type:  Schema.Types.ObjectId,
        required:true
    },
    diff_easy: {
        type: String
    },
    diff_medium:{
        type:String
    },
    diff_hard:{
        type:String
    },
    diff_master:{
        type:String
    },
    exclude:{
        type:String,
        default: ""
    },
    include:{
        type:String,
        default: ""
    },
    order:{
        type:String,
        default: ""
    },
    order_by:{
        type:String,
        default: ""
    },
    time_max_unit:{
        type:String,
        default: ""
    },
    time_max_value:{
        type:String,
        default: ""
    },
    time_min_unit:{
        type:String,
        default: ""
    },
    time_min_value:{
        type:String,
        default: ""
    }
}, { timestamps: true })
module.exports = model('Search', searchSchema)