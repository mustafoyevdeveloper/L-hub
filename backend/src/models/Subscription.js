import { Schema, model, Types } from 'mongoose'

const SubscriptionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, enum: ['STANDARD','VIP'], required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: ['UZS','USD','RUB'], required: true },
  validUntil: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } })

export default (globalThis.mongoose_models_Subscription ||= model('Subscription', SubscriptionSchema))


