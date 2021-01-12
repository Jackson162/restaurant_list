//This is a restaurant model
//import mongoose
const mongoose = require('mongoose')
//SchemaType constructor
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    name_en: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    google_map: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: Schema.Types.ObjectId
      ref: 'User',
      index: true,
      required: true
    }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)