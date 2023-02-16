import { Schema, model } from 'mongoose';

const alarmRuleSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, required: [true] },
    emqxRuleId: { type: String, required: [true] },
    variableFullName: { type: String },
    message: { type: String },
    variable: { type: String },
    value: { type: Number },
    condition: { type: String },
    triggerTime: { type: Number, default: 30 },
    status: { type: Boolean, default: true },
    counter: { type: Number, default: 0 },
    createdTime: { type: Number }
});

const AlarmRuleModel = model('AlarmRule', alarmRuleSchema);


export default AlarmRuleModel;  