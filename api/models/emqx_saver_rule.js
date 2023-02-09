import {Schema, model} from 'mongoose';
import mongooseUniqueValidator from "mongoose-unique-validator";

const saverRuleSchema = new Schema({
    dId: { type: String, required: [true] ,unique:true},
    emqxRuleId: { type: String, required: [true] },
    status: { type: Boolean, required: [true] }
});

saverRuleSchema.plugin(mongooseUniqueValidator, { message: 'Error, dId already exists.' });

const SaverRuleModel = model('SaverRule', saverRuleSchema);

export default SaverRuleModel;