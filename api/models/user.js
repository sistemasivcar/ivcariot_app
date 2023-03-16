import mongoose from "mongoose";
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '"name" field is required'],
        min: [3, '"name" field is too short'],
        max: [512, '"name" field is too long']
    },
    email: {
        type: String,
        required: [true, '"email" field is required'],
        min: [3, '"email" field is too short'],
        max: [512, '"email" field is too long'],
        unique: true
    },
    password: {
        type: String,
        required: [true, '"password" field is required'],
        min: [3, '"password" field is too short'],
        max: [512, '"password" field is too long']
        
    },
    phones: { type: Array },
    country: { type: String },
    city: { type: String },
    codezip: { type: String },
    config:{type:Object}
});

userSchema.plugin(uniqueValidator, { message: 'Sorry, email already exists ):' });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;

