const {Schema , model} = require('mongoose')


const userSchema = new Schema(
    {
      username: {
        type: String,
        required: true
      },
      email: {
        type: String,
        default: null
      },
      password: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        enum: ['M','F','Other'],
        default: 'Other'
      },
      type: {
        type: String,
        enum: ['admin','moderator','normal'],
        default: 'normal'
      },
      favorite:{
          type: Array,
          default: null
      },
      can_comment:{
        type: String,
        enum: ['yes','no'],
        default: 'yes'
      },
      access:{
        type: String,
        enum: ['yes','no'],
        default: 'yes'
      },
      can_post:{
        type: String,
        enum: ['yes','no'],
        default: 'yes'
      }
    },
    { timestamps: true }
  )

module.exports = model('users', userSchema)
