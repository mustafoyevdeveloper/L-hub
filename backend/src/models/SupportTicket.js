import { Schema, model, Types } from 'mongoose'

const SupportTicketSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  status: { type: String, enum: ['OPEN','CLOSED'], default: 'OPEN' },
}, { timestamps: true })

export default (globalThis.mongoose_models_SupportTicket ||= model('SupportTicket', SupportTicketSchema))


