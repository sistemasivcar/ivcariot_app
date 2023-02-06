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
        equired: [true, '"email" field is required'],
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
});

userSchema.plugin(uniqueValidator, { message: 'Error, email already exists' });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;

