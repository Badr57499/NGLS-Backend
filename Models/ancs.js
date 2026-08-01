const mongoose = require('mongoose')

const ancSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdat: { type: Date, required: true, default: Date.now },
    image: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Ancs', ancSchema)