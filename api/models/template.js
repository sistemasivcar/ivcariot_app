import {Schema, model} from 'mongoose';


const templateSchema = new Schema({
    userId: { type: String, required: [true] },
    name: { type: String, required: [true, 'Temlpate name is required'] },
    description: { type: String },
    createdTime: { type: Number, required: [true] },
    widgets: { type: Array, default: [] }
});


// Schema to model.
const templateModel = model('Template', templateSchema);

export default templateModel;