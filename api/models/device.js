import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const deviceSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, unique: true, required: [true, '"name" is required'] },
    name: { type: String, required: [true, '"name" is required'] },
    selected: { type: Boolean, required: [true], default: false },
    templateId: { type: Schema.Types.ObjectId, required: [true], ref:'Template' },
    templateName: { type: String, required: [true] },
    whpassword: { type: String, required: [true] },
    status: { type: String, default:'offline' }, // offline, online
    createdTime: { type: Number },
    saverRule: { type: Schema.Types.ObjectId, ref: 'SaverRule' },
    alarmRules: [{ type: Schema.Types.ObjectId, ref:'AlarmRule'}]
});

deviceSchema.plugin(mongooseUniqueValidator, { message: 'Error, device already exists.' });

// Schema to model.
const Device = model('Device', deviceSchema);

export default Device;