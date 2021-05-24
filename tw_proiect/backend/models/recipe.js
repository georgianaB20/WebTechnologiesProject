const {Schema , model} = require('mongoose')


const recipeSchema = new Schema(
    {
      title: {
        type: String,
        required: true
      },
      ingredients: {
        type: Array,
        required: true
      },
      time_value: {
        type: Number,
        required: true
      },
      time_unit:{
        type: String,
        enum: ['minute','ore','zile'],
        required: true,
        default: 'minute'
      },
      difficulty: {
        type: String,
        enum: ['incepator','mediu','bun','foarte_bun','master_chef'],
        default: 'incepator'
      },
      description: {
        type: String,
        default: null
      },
      picture:{
          type: Buffer,
          ContentType: String,
          default:null
      },
      username:{
          type: String,
          // ref: 'users'
      },
      comments:{
          type: Array,
          default: null
      }
    },
    { timestamps: true }
  )
module.exports = model('Recipe', recipeSchema)
