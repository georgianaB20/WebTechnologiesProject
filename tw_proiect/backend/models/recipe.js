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
        enum: ['min','h','d'],
        required: true,
        default: 'min'
      },
      difficulty: {
        type: String,
        enum: ['Usor','Mediu','Greu','Master Chef'],
        default: 'Usor'
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
      },
      picture_type:{
        type: String,
        default: null
      }
    },
    { timestamps: true }
  )
module.exports = model('Recipe', recipeSchema)
