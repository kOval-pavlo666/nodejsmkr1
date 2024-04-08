const { type } = require('express/lib/response');
const { Schema, model } = require('mongoose');

const secondSchema = new Schema({
    number: { 
        type: Number,
    },
    productOfEvenDigits: { 
        type: Number
    }
}, {
    timestamps: true,
});

module.exports = model('second', secondSchema);
