import { Schema, model, ObjectId } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const deviceSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, unique: true, required: [true, '"name" is required'] },
    name: { type: String, required: [true, '"name" is required'] },
    selected: { type: Boolean, required: [true], default: false },
    templateId: { type: String, required: [true] },
    templateName: { type: String, required: [true] },
    createdTime: { type: Number },
    saverRule: { type: Schema.Types.ObjectId, ref: 'SaverRule'}
});

deviceSchema.plugin(mongooseUniqueValidator, { message: 'Error, device already exists.' });

// Schema to model.
const Device = model('Device', deviceSchema);

export default Device;