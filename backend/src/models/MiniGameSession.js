import { Schema, model, Types } from 'mongoose'

const MiniGameSessionSchema = new Schema({
  miniGameId: { type: Types.ObjectId, ref: 'MiniGame', required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  pointsEarned: { type: Number, required: true },
  createdAt: { type: Date, default: () => new Date() },
})

export default (globalThis.mongoose_models_MiniGameSession ||= model('MiniGameSession', MiniGameSessionSchema))


