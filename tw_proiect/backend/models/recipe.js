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
      time: {
        type: Number,
        required: true
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
          type: String,
          default:null
      },
      username:{
          type: String,
          // ref: 'users'
      },
      comments: [{
          type: Schema.Types.ObjectId,
          ref: 'Comment'
      }],
      picture_type:{
        type: String,
        default: null
      }
    },
    { timestamps: true }
  )
module.exports = model('Recipe', recipeSchema)
