import {Schema, model} from 'mongoose';
import mongooseUniqueValidator from "mongoose-unique-validator";


const templateSchema = new Schema({
    userId: { type: String, required: [true] },
    name: { type: String, unique: true, required: [true, 'Temlpate name is required'] },
    description: { type: String },
    createdTime: { type: Number, required: [true] },
    widgets: { type: Array, default: [] },
    isPublic:{type:Boolean, default:false, required:[true]},

});

templateSchema.plugin(mongooseUniqueValidator, { message: 'Lo sentimos, ese nombre ya está en uso!' });

// Schema to model.
const templateModel = model('Template', templateSchema);

export default templateModel;