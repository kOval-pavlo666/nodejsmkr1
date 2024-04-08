const { type } = require('express/lib/response');
const { Schema, model } = require('mongoose');

const calculateSchema = new Schema({
    input: { 
        side1:{
            type:Number,
        },
        side2:{
            type:Number,
        }, 
        side3:{
            type:Number,
        } 
    },
    result: { inscribedRadius:{
            type:Number,
        },
        circumscribedRadius:{
            type:Number,
        } 
    }
}, {
    timestamps: true,
});

module.exports = model('calculate', calculateSchema);
