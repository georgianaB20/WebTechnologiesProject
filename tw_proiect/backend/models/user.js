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
        enum: ['admin','normal'],
        default: 'normal'
      },
      
      
      favorite:{
          type: Array,
          default: null
      }
    },
    { timestamps: true }
  )

module.exports = model('users', userSchema)
