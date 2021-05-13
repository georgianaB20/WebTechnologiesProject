const {Schema , model} = require('mongoose')


const recipeSchema = new Schema(
    {
      titlu: {
        type: String,
        required: true
      },
      ingrediente: {
        type: Array,
        required: true
      },
      valoare_timp: {
        type: Number,
        required: true
      },
      unitate_timp:{
        type: String,
        enum: ['min','h','d'],
        required: true,
        default: 'min'
      },
      nivel_dificultate: {
        type: String,
        enum: ['incepator','mediu','bun','foarte_bun','master_chef'],
        default: 'incepator'
      },
      pasi_preparare: {
        type: String,
        default: null
      },
      poza:{
          type: Buffer,
          ContentType: String,
          default:null
      },
      username:{
          type: String,
          // ref: 'users'
      },
      comentarii:{
          type: Array,
          default: null
      }
    },
    { timestamps: true }
  )
module.exports = model('recipe', recipeSchema)
