import {Schema, model} from 'mongoose';

const saverRuleSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, required: [true] },
    emqxRuleId: { type: String, required: [true] },
    status: { type: Boolean, required: [true] }
});

const SaverRuleModel = model('SaverRule', saverRuleSchema);

export default SaverRuleModel;