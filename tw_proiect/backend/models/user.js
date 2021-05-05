const {Schema , model} = require('mongoose')


const userSchema = new Schema(
    {
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['admin','normal'],
        default: 'normal'
      },
      email: {
        type: String,
        default: null
      },
      gender: {
        type: String,
        enum: ['M','F','Other'],
        default: 'Other'
      },
      favorite:{
          type: Array,
          default: null
      }
    },
    { timestamps: true }
  )

module.exports = model('users', userSchema)
