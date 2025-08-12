import mongoose, { Schema, model, Types } from 'mongoose'

const DepositRequestSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['UZS','USD','RUB'], required: true },
  method: { type: String, required: true }, // e.g. card number or bank name
  receiptUrl: { type: String, required: true },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING', index: true },
  adminNote: { type: String },
}, { timestamps: true })

export default mongoose.models.DepositRequest || model('DepositRequest', DepositRequestSchema)


