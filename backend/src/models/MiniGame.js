import { Schema, model } from 'mongoose'

const MiniGameSchema = new Schema({
  title: { type: String, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  subscriptionRequired: { type: Boolean, default: true },
})

export default (globalThis.mongoose_models_MiniGame ||= model('MiniGame', MiniGameSchema))


